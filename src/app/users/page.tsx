"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useProjectStore, UserRole } from "@/store/project-store";

export default function UsersPage() {
  const { projects, activeProjectId, addUser, removeUser } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");

  if (!project) return <div>No project selected</div>;

  const handleAddUser = () => {
    if (name && email) {
      addUser({
        name,
        email,
        avatarUrl: "",
        chatPlatformId: email,
        position: "",
      });
      setName("");
      setEmail("");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Users</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-40"
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-48"
          />
          <select
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800 w-32"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="owner">Owner</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {project.users.map((user) => (
          <UserCard key={user.id} user={user} onRemove={() => removeUser(user.id)} />
        ))}
      </div>
    </div>
  );
}

interface UserCardProps {
  user: { id: string; name: string; email: string; position?: string; phone?: string };
  onRemove: () => void;
}

function UserCard({ user, onRemove }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>Position: {user.position || "—"}</p>
        <p>Phone: {user.phone || "—"}</p>
      </CardContent>
    </Card>
  );
}