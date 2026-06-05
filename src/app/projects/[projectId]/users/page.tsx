"use client";

import { useMemo } from "react";
import { useProjectStore } from "@/store/project-store";

export default function UsersPage() {
  const { projects, activeProjectId } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);

  if (!project) return <div>No project selected</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Project Users</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {project.users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}