"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FileText, Clock } from "lucide-react";
import { useProjectStore } from "@/store/project-store";

export default function CallsPage() {
  const { projects, activeProjectId, isLoading } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);

  if (isLoading || !project) return <div>Loading calls...</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calls</h2>
        <Button>
          <Calendar className="mr-2 h-4 w-4" /> Schedule Call
        </Button>
      </div>

      <div className="grid gap-3">
        {project.calls.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No calls recorded yet. Connect Yandex Telemost for automatic call tracking.
          </p>
        ) : (
          project.calls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))
        )}
      </div>
    </div>
  );
}

interface CallCardProps {
  call: { id: string; platform: string; meetingUrl: string; title: string; startedAt?: string; endedAt?: string; transcript: string; summary: string; participantIds: string[] };
}

function CallCard({ call }: CallCardProps) {
  const formatDuration = (start?: string, end?: string) => {
    if (!start || !end) return "—";
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.floor((e.getTime() - s.getTime()) / 60000);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{call.title || "Untitled Call"}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {call.startedAt ? new Date(call.startedAt).toLocaleDateString() : "—"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(call.startedAt, call.endedAt)}
              </span>
              <span>{call.participantIds.length} participants</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-3 w-3" /> Join
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-3 w-3" /> Transcript
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{call.summary || "No summary available."}</p>
        {call.transcript && (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Transcript</summary>
            <pre className="mt-2 p-3 bg-muted rounded text-xs whitespace-pre-wrap">{call.transcript}</pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}