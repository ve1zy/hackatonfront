"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "@/store/project-store";

export default function ChatPage() {
  const { projects, activeProjectId } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);
  const [message, setMessage] = useState("");

  if (!project) return <div>No project selected</div>;

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Chat History</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {project.messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No messages yet. Connect your Telegram chat for automatic sync.
          </p>
        ) : (
          project.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Send message to project chat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: { id: string; userId?: string; content: string };
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{message.userId?.[0] || "S"}</AvatarFallback>
      </Avatar>
      <Card className="flex-1">
        <CardContent className="p-3">
          <p className="text-sm">{message.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}