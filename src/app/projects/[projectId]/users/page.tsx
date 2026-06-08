"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, User, Phone, Send, Plus } from "lucide-react";
import { useProjectStore, UserRole } from "@/store/project-store";

export default function UsersPage() {
  const { projects, activeProjectId, addUser, removeUser, isLoading } = useProjectStore();
  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("member");

  if (isLoading || !project) return <div>Loading users...</div>;

  const handleAddUser = () => {
    if (newEmail.trim()) {
      addUser({
        name: newName || newEmail.split('@')[0],
        email: newEmail,
        avatarUrl: '',
        chatPlatformId: newEmail,
        role: newRole,
      });
      setNewEmail("");
      setNewName("");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Members</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-48"
          />
          <Input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-32"
          />
          <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
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
  user: { id: string; name: string; email: string; position?: string; phone?: string; telegram?: string; avatarUrl?: string };
  onRemove: () => void;
}

function UserCard({ user, onRemove }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {user.position && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{user.position}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.telegram && (
          <div className="flex items-center gap-2">
            <Send className="h-3 w-3 text-muted-foreground" />
            <span>{user.telegram}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}