"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, Users } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);
  const [remindHours, setRemindHours] = useState("24");
  const [notifyTime, setNotifyTime] = useState("09:00");

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Settings</h2>

      <div className="grid gap-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </CardTitle>
            <CardDescription>Configure how users receive reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email notifications</span>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Chat notifications</span>
              <Switch checked={notifyChat} onCheckedChange={setNotifyChat} />
            </div>
            <div>
              <label className="text-sm mb-2 block">Remind before due</label>
              <Select value={remindHours} onValueChange={setRemindHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block flex items-center gap-1">
                <Clock className="h-4 w-4" /> Daily digest time
              </label>
              <input
                type="time"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={notifyTime}
                onChange={(e) => setNotifyTime(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Administration
            </CardTitle>
            <CardDescription>Manage project administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin users can manage members and configure integrations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}