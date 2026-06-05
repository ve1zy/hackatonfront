import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { ColumnType } from "@/store/board-store";

interface TelegramCommand {
  id: string;
  command: string;
  chatId: number;
  timestamp: number;
  processed: boolean;
}

const COMMANDS_FILE = join(process.cwd(), "commands.json");

async function readCommands(): Promise<TelegramCommand[]> {
  try {
    const data = await fs.readFile(COMMANDS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCommands(commands: TelegramCommand[]) {
  await fs.writeFile(COMMANDS_FILE, JSON.stringify(commands, null, 2));
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || body.edited_message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text;

    if (!text || !chatId) {
      return NextResponse.json({ ok: true });
    }

    const commands = await readCommands();
    const newCommand: TelegramCommand = {
      id: crypto.randomUUID(),
      command: text.trim(),
      chatId,
      timestamp: Date.now(),
      processed: false,
    };

    await writeCommands([...commands, newCommand]);

    const responseText = await processCommand(text);
    if (responseText) {
      await sendTelegramMessage(chatId, responseText);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function processCommand(text: string): Promise<string | null> {
  const cmd = text.trim();

  if (cmd === "/help") {
    return `❓ Available commands:
/new [title] [column] - Create card (todo/in-progress/done)
/list - List commands
/move [id] [column] - Move card
/delete [id] - Delete card
/clear - Clear all cards
/columns - Show columns`;
  }

  if (cmd === "/columns") {
    return "📌 Columns: todo, in-progress, done";
  }

  if (cmd === "/list") {
    const commands = await readCommands();
    const pending = commands.filter((c) => !c.processed).slice(-10);
    return pending.length
      ? `📋 Recent commands:\n${pending.map((c) => c.command).join("\n")}`
      : "📋 No pending commands";
  }

  return `✅ Command received: ${cmd}. Open the web app to see results.`;
}

export async function GET() {
  const commands = await readCommands();
  const unprocessed = commands.filter((c) => !c.processed);

  if (unprocessed.length === 0) {
    return NextResponse.json({ cards: [], actions: [] });
  }

  const actions = [];
  for (const cmd of unprocessed) {
    const action = parseCommand(cmd.command);
    if (action) {
      actions.push({ ...action, commandId: cmd.id });
    }
    cmd.processed = true;
  }

  await writeCommands(commands);
  return NextResponse.json({ cards: [], actions });
}

type CardAction = { type: "create" | "move" | "delete" | "clear"; data: Record<string, string | undefined> };

function parseCommand(text: string): CardAction | null {
  const cmd = text.toLowerCase().trim();

  if (cmd.startsWith("/new ")) {
    const parts = text.substring(5).split(" ").filter(Boolean);
    const column = (parts[1] || "todo") as ColumnType;
    return { type: "create", data: { title: parts[0], column } };
  }

  if (cmd.startsWith("/move ")) {
    const parts = text.substring(6).split(" ").filter(Boolean);
    const column = parts[1] as ColumnType | undefined;
    return { type: "move", data: { id: parts[0], column } };
  }

  if (cmd.startsWith("/delete ")) {
    return { type: "delete", data: { id: text.substring(8).trim() } };
  }

  if (cmd === "/clear") {
    return { type: "clear", data: {} };
  }

  return null;
}