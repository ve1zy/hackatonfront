"use client";

import { usePathname, useParams } from "next/navigation";
import { useProjectStore } from "@/store/project-store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const tabs = [
  { id: "tasks", label: "Tasks", href: (projectId: string) => `/projects/${projectId}/tasks` },
  { id: "users", label: "Users", href: (projectId: string) => `/projects/${projectId}/users` },
  { id: "calls", label: "Calls", href: (projectId: string) => `/projects/${projectId}/calls` },
  { id: "chat", label: "Chat", href: (projectId: string) => `/projects/${projectId}/chat` },
  { id: "settings", label: "Settings", href: (projectId: string) => `/projects/${projectId}/settings` },
];

export function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { projects, activeProjectId, setActiveProject } = useProjectStore();
  const params = useParams();
  const pathname = usePathname();

  // In App Router, params may be a Promise in some versions
  const projectId = typeof params?.projectId === 'string' ? params.projectId : String(params?.projectId || '');

  useEffect(() => {
    if (!activeProjectId && projectId) {
      setActiveProject(projectId);
    }
  }, [projectId, activeProjectId, setActiveProject]);

  const project = projects.find((p) => p.id === activeProjectId || p.id === projectId);

  if (!project || !projectId) {
    return <div className="h-screen w-full">{children}</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background px-4 py-3">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </header>

      <nav className="border-b bg-muted/40 px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.href(projectId)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:bg-background rounded-t-md",
                pathname === tab.href(projectId) ? "bg-background" : "text-muted-foreground"
              )}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}