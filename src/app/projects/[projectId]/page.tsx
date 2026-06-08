"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/store/project-store";

export default function ProjectRedirect({ params: { projectId } }: { params: { projectId: string } }) {
  const { projects, setActiveProject } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    const projectExists = projects.some((p) => p.id === projectId);
    if (projectExists) {
      setActiveProject(projectId);
    } else {
      router.replace("/");
    }
  }, [projects, projectId, setActiveProject, router]);

  return null;
}