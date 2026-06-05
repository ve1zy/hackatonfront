"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Column } from "./column";
import { useBoardStore, ColumnType } from "@/store/board-store";

export function Board() {
  const { columns, addCard, cards } = useBoardStore();
  const [newCardTitle, setNewCardTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>("todo");
  const [telegramUrl, setTelegramUrl] = useState("");

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard({ title: newCardTitle, description: "", column: selectedColumn });
      setNewCardTitle("");
    }
  };

  const handleTelegramSetup = () => {
    if (telegramUrl.trim()) {
      localStorage.setItem("telegram-webhook-url", telegramUrl);
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notion Board</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Telegram Integration</DialogTitle>
              <DialogDescription>
                Enter your Telegram bot webhook URL for AI agent control
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="telegram-url">Webhook URL</Label>
                <Input
                  id="telegram-url"
                  placeholder="https://api.telegram.org/botYOUR_BOT_TOKEN/webhook"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                />
              </div>
              <div className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-800">
                <p className="text-sm">
                  Set TELEGRAM_BOT_TOKEN in .env.local for full integration.
                  <br />
                  Webhook endpoint: <code className="text-xs">/api/telegram</code>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleTelegramSetup}>Save Configuration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="New card title..."
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
        />
        <select
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value as ColumnType)}
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
        <Button onClick={handleAddCard}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <Column key={column} column={column} cards={cards.filter((c) => c.column === column)} />
        ))}
      </div>
    </div>
  );
}