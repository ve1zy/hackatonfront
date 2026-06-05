"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import { useProjectStore } from "@/store/project-store";

export default function CallsPage() {
  const { projects, activeProjectId } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);

  if (!project) return <div>No project selected</div>;

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
            <Card key={call.id}>
              <CardHeader>
                <CardTitle>{call.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-3 w-3" /> Join
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-3 w-3" /> Transcript
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{call.summary}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}