import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColumnType = 'backlog' | 'in-progress' | 'done';
export type UserRole = 'owner' | 'member' | 'viewer';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'success' | 'failed' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  chatPlatformId: string;
  position?: string;
  phone?: string;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  assigneeId?: string;
  createdBy: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  sourceMessageId?: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  inviteLink: string;
  createdBy?: string;
  users: User[];
  tasks: Task[];
  calls: Call[];
  messages: ChatMessage[];
  events: AgentEvent[];
}

export interface ChatMessage {
  id: string;
  userId?: string;
  content: string;
  platformMessageId: string;
  processed: boolean;
  sentAt: string;
}

export interface Call {
  id: string;
  platform: string;
  meetingUrl: string;
  title: string;
  startedAt?: string;
  endedAt?: string;
  transcript: string;
  summary: string;
  participantIds: string[];
}

export interface AgentEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  errorMessage?: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  addProject: (project: Omit<Project, 'id' | 'users' | 'tasks' | 'calls' | 'messages' | 'events'> & { inviteLink: string }) => void;
  setActiveProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdBy' | 'tags'> & { assigneeId?: string }) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, columnId: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: crypto.randomUUID(),
          users: [],
          tasks: [],
          calls: [],
          messages: [],
          events: [],
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: newProject.id,
        }));
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      addTask: (task) => {
        const projectId = get().activeProjectId;
        if (!projectId) return;
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdBy: task.assigneeId || "system",
          tags: [],
        };
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: [...p.tasks, newTask] }
              : p
          ),
        }));
      },

      updateTask: (id, task) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
          })),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.filter((t) => t.id !== id),
          })),
        }));
      },

      moveTask: (id, columnId) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === id ? { ...t, columnId } : t
            ),
          })),
        }));
      },

      addUser: (user) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === state.activeProjectId
              ? {
                  ...p,
                  users: [...p.users, { ...user, id: crypto.randomUUID() }],
                }
              : p
          ),
        }));
      },

      removeUser: (id) => {
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            users: p.users.filter((u) => u.id !== id),
          })),
        }));
      },
    }),
    { name: 'notion-projects-storage' }
  )
);