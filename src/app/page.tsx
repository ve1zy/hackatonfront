"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FolderPlus, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "@/store/project-store";

export default function ProjectsPage() {
  const { projects, addProject } = useProjectStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const handleCreateProject = () => {
    if (name.trim() && inviteLink.trim()) {
      addProject({ name, description, inviteLink });
      setName("");
      setDescription("");
      setInviteLink("");
    }
  };

  return (
    <div className="flex h-screen flex-col p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Enter project details and Telegram chat invite link
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="Telegram chat invite link"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}/tasks`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {project.users.length} users
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.inviteLink, "_blank", "noopener,noreferrer");
                  }}
                  className="text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" /> Open Chat
                </button>
              </div>
            </CardContent>
</Card>
           </Link>
         ))}
       </div>
    </div>
  );
}