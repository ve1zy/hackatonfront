import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Notion Board API",
    endpoints: {
      webhook: "/api/webhook - POST for Telegram bot integration"
    },
    columns: ["todo", "in-progress", "done"]
  });
}