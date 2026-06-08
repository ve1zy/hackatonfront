const API_BASE = '/api';

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  return res.json();
}

export async function fetchProjectsByUser(userId: string) {
  const res = await fetch(`${API_BASE}/projects?userId=${userId}`);
  return res.json();
}

export async function fetchProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  return res.json();
}

export async function fetchProjectDashboard(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}/dashboard`);
  if (!res.ok) throw new Error(`Failed to fetch project dashboard: ${res.status}`);
  return res.json();
}

export async function createProject(data: { name: string; description: string; createdBy: string; chatInviteLink?: string }) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchTasks(projectId: string) {
  const res = await fetch(`${API_BASE}/tasks?projectId=${projectId}`);
  return res.json();
}

export async function createTask(data: {
  projectId: string;
  columnName: string;
  title: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  createdBy?: string;
}) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId: data.projectId,
      columnName: data.columnName,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      assigneeId: data.assigneeId,
      createdById: data.createdBy || 'system',
    }),
  });
  return res.json();
}

export async function updateTask(id: string, data: Partial<{
  title: string;
  description: string;
  priority: string;
  assigneeId: string;
  columnId: string;
  columnName: string;
  projectId: string;
}>) {
  const columnName = data.columnId ? 
    (data.columnId === 'in-progress' ? 'In Progress' : 
     data.columnId === 'done' ? 'Done' : 'Backlog') : data.columnName;
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, columnName }),
  });
  return res.json();
}

export async function deleteTask(id: string) {
  await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
}

export async function fetchUsers(projectId: string) {
  const res = await fetch(`${API_BASE}/project-members?projectId=${projectId}`);
  return res.json();
}

export async function addUserToProject(data: { projectId: string; userId: string; role?: string }) {
  const res = await fetch(`${API_BASE}/project-members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function removeUserFromProject(id: string) {
  await fetch(`${API_BASE}/project-members/${id}`, { method: 'DELETE' });
}

export async function fetchCalls(projectId: string) {
  const res = await fetch(`${API_BASE}/calls?projectId=${projectId}`);
  return res.json();
}

export async function createCall(data: {
  projectId: string;
  platform: string;
  meetingUrl: string;
  title?: string;
}) {
  const res = await fetch(`${API_BASE}/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addCallParticipant(callId: string, userId: string) {
  const res = await fetch(`${API_BASE}/calls/${callId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function fetchChatMessages(projectId: string) {
  const res = await fetch(`${API_BASE}/chat-messages?projectId=${projectId}`);
  return res.json();
}

export async function createChatMessage(data: {
  projectId: string;
  userId?: string;
  content: string;
  platformMessageId?: string;
}) {
  const res = await fetch(`${API_BASE}/chat-messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createUser(data: { email: string; name?: string }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function registerUser(data: { username: string; password: string; name?: string }) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}