"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProjectStore } from "@/store/project-store";

export default function ChatPage() {
  const { projects, activeProjectId, isLoading } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);

  if (isLoading || !project) return <div>Loading chat...</div>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Chat Analysis</h2>

      {project.messages.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No messages yet. Connect your chat platform for automatic sync.
        </p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Messages</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {project.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ChatMessageProps {
  message: { id: string; userId?: string; content: string; sentAt: string };
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
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(message.sentAt).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}