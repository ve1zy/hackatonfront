"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, ExternalLink, LogIn, LogOut, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useProjectStore } from "@/store/project-store";
import { useAuthStore } from "@/store/auth-store";

export default function ProjectsPage() {
  const { projects, addProject, loadProjectsByUser, isLoading } = useProjectStore();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const { user, login, register } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  useEffect(() => {
    if (user) {
      loadProjectsByUser(user.id);
    }
  }, [user, loadProjectsByUser]);

  const handleCreateProject = async () => {
    if (!user) return;
    if (name.trim() && inviteLink.trim()) {
      await addProject({ name, description, createdBy: user.id, inviteLink });
      setName("");
      setDescription("");
      setInviteLink("");
    }
  };

  const handleLogin = async () => {
    if (loginUsername.trim() && loginPassword.trim()) {
      await login(loginUsername, loginPassword);
      setLoginUsername("");
      setLoginPassword("");
    }
  };

  const handleRegister = async () => {
    if (registerUsername.trim() && registerPassword.trim()) {
      await register(registerUsername, registerPassword, registerName || registerUsername);
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterName("");
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in or register to manage your projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sign In</p>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button onClick={handleLogin}>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Register</p>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Choose username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <Input
                  placeholder="Your name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                <Button onClick={handleRegister}>
                  <UserPlus className="mr-2 h-4 w-4" /> Register
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => useAuthStore.getState().logout()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
          <Button onClick={() => setProjectDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      </header>

        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Enter project details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Input placeholder="Invite Link" value={inviteLink} onChange={(e) => setInviteLink(e.target.value)} />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isLoading ? (
  <div className="flex items-center justify-center h-full">Loading...</div>
) : projects.length === 0 ? (
  <div className="flex h-full items-center justify-center">
    <p className="text-muted-foreground">No projects yet. Create your first project!</p>
  </div>
) : (
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
                {project.users.length} members
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
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
)}
    </div>
  );
}