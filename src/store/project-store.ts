import { create } from 'zustand';

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
  telegram?: string;
  timezone?: string;
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

interface ApiProject {
  id: string;
  name: string;
  description?: string;
  chatInviteLink?: string;
  createdBy?: string;
}

interface ApiTask {
  id: string;
  boardId?: string;
  board?: { id: string };
  columnId?: string;
  column?: { id: string; name: string };
  assigneeId?: string;
  assignee?: { id: string };
  createdBy?: string;
  createdByFull?: { id: string };
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  completedAt?: string;
  sourceMessageId?: string;
  tags?: Array<{ tag: string }>;
}

interface ApiCall {
  id: string;
  platform: string;
  meetingUrl: string;
  title?: string;
  startedAt?: string;
  endedAt?: string;
  transcript?: string;
  summary?: string;
  participants?: Array<{ user?: { id: string }; userId?: string }>;
}

interface ApiChatMessage {
  id: string;
  userId?: string;
  user?: { id: string };
  content: string;
  platformMessageId?: string;
  processedByAgent?: boolean;
  sentAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  addProject: (project: { name: string; description: string; createdBy: string; inviteLink: string }) => Promise<void>;
  setActiveProject: (id: string) => Promise<void>;
  addTask: (task: { columnId: string; title: string; description: string; priority: TaskPriority; assigneeId?: string }, createdById?: string) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, columnId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'> & { role?: UserRole }) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  fetchAndSetProject: (id: string) => Promise<void>;
  loadProjects: () => Promise<void>;
  loadProjectsByUser: (userId: string) => Promise<void>;
}

const mapColumnType = (columnName: string | undefined): ColumnType => {
  const name = columnName?.toLowerCase() || '';
  if (name === 'backlog') return 'backlog';
  if (name === 'in progress' || name === 'in-progress') return 'in-progress';
  if (name === 'done') return 'done';
  return 'backlog';
};

const mapProjectFromApi = (p: ApiProject): Project => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  inviteLink: p.chatInviteLink || '',
  createdBy: p.createdBy,
  users: [],
  tasks: [],
  calls: [],
  messages: [],
  events: [],
});

const mapTaskFromApi = (t: ApiTask): Task => ({
  id: t.id,
  boardId: t.board?.id || t.boardId || '',
  columnId: mapColumnType(t.column?.name),
  assigneeId: t.assignee?.id || t.assigneeId,
  createdBy: t.createdByFull?.id || t.createdBy || '',
  title: t.title,
  description: t.description || '',
  priority: (t.priority || 'medium') as TaskPriority,
  dueDate: t.dueDate,
  completedAt: t.completedAt,
  sourceMessageId: t.sourceMessageId,
  tags: t.tags?.map((tag) => tag.tag) || [],
});

const mapCallFromApi = (c: ApiCall): Call => ({
  id: c.id,
  platform: c.platform,
  meetingUrl: c.meetingUrl,
  title: c.title || '',
  startedAt: c.startedAt,
  endedAt: c.endedAt,
  transcript: c.transcript || '',
  summary: c.summary || '',
  participantIds: c.participants?.map((p) => p.user?.id || p.userId || '') || [],
});

const mapMessageFromApi = (m: ApiChatMessage): ChatMessage => ({
  id: m.id,
  userId: m.user?.id || m.userId,
  content: m.content,
  platformMessageId: m.platformMessageId || '',
  processed: m.processedByAgent || false,
  sentAt: m.sentAt,
});

export const useProjectStore = create<ProjectState>()((set, get) => ({
      projects: [],
      activeProjectId: null,
      isLoading: false,

      loadProjects: async () => {
        set({ isLoading: true });
        try {
          const { fetchProjects } = await import('@/lib/api');
          const projects = await fetchProjects();
          set({ projects: projects.map(mapProjectFromApi), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      loadProjectsByUser: async (userId) => {
        set({ isLoading: true });
        try {
          const { fetchProjectsByUser } = await import('@/lib/api');
          const projects = await fetchProjectsByUser(userId);
          set({ projects: projects.map(mapProjectFromApi), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addProject: async (project) => {
        const { createProject } = await import('@/lib/api');
        const newProject = await createProject({
          name: project.name,
          description: project.description,
          createdBy: project.createdBy || 'system',
          chatInviteLink: project.inviteLink,
        });
        set((state) => ({
          projects: [...state.projects, mapProjectFromApi(newProject)],
          activeProjectId: newProject.id,
        }));
      },

      setActiveProject: async (id) => {
        await get().fetchAndSetProject(id);
      },

fetchAndSetProject: async (id: string) => {
        const { fetchProjectDashboard } = await import('@/lib/api');
        const dashboard = await fetchProjectDashboard(id);
        if (!dashboard?.project) return;
        const mappedProject: Project = {
          ...mapProjectFromApi(dashboard.project),
          users: dashboard.members?.map((m: { user?: User; userId?: string }) => ({
            ...m.user,
            id: m.user?.id || m.userId || '',
          })) || [],
          tasks: dashboard.tasks?.map(mapTaskFromApi) || [],
          calls: dashboard.calls?.map(mapCallFromApi) || [],
          messages: dashboard.chatMessages?.map(mapMessageFromApi) || [],
        };
        set((state) => {
          const existingIndex = state.projects.findIndex((p) => p.id === id);
          if (existingIndex >= 0) {
            return {
              projects: state.projects.map((p) => (p.id === id ? mappedProject : p)),
              activeProjectId: id,
            };
          }
          return {
            projects: [...state.projects, mappedProject],
            activeProjectId: id,
          };
        });
      },

addTask: async (task, createdById?: string) => {
         const projectId = get().activeProjectId;
         if (!projectId) {
           console.error('addTask: No activeProjectId');
           return;
         }
         try {
           const { createTask } = await import('@/lib/api');
           const columnName = task.columnId === 'in-progress' ? 'In Progress' : 
                             task.columnId === 'done' ? 'Done' : 'Backlog';
           const result = await createTask({
             projectId,
             columnName,
             title: task.title,
             description: task.description,
             priority: task.priority,
             assigneeId: task.assigneeId,
             createdBy: createdById,
           });
           console.log('addTask created:', result);
           await get().fetchAndSetProject(projectId);
         } catch (error) {
           console.error('addTask error:', error);
         }
       },

      updateTask: async (id, task) => {
        const { updateTask: apiUpdateTask } = await import('@/lib/api');
        await apiUpdateTask(id, task);
        const projectId = get().activeProjectId;
        if (projectId) {
          try {
            await get().fetchAndSetProject(projectId);
          } catch (error) {
            console.error('Failed to refresh project after updateTask:', error);
          }
        }
      },

      deleteTask: async (id) => {
        const { deleteTask: apiDeleteTask } = await import('@/lib/api');
        await apiDeleteTask(id);
        const projectId = get().activeProjectId;
        if (projectId) {
          try {
            await get().fetchAndSetProject(projectId);
          } catch (error) {
            console.error('Failed to refresh project after deleteTask:', error);
          }
        }
      },

      moveTask: async (id, columnId) => {
        const { updateTask: apiUpdateTask } = await import('@/lib/api');
        await apiUpdateTask(id, { columnId });
        const projectId = get().activeProjectId;
        if (projectId) {
          try {
            await get().fetchAndSetProject(projectId);
          } catch (error) {
            console.error('Failed to refresh project after moveTask:', error);
          }
        }
      },

      addUser: async (user) => {
        const projectId = get().activeProjectId;
        if (!projectId) return;
        const { addUserToProject } = await import('@/lib/api');
        await addUserToProject({
          projectId,
          userId: user.chatPlatformId,
          role: user.role || 'member',
        });
        try {
          await get().fetchAndSetProject(projectId);
        } catch (error) {
          console.error('Failed to refresh project after addUser:', error);
        }
      },

      removeUser: async (id) => {
        const { removeUserFromProject } = await import('@/lib/api');
        await removeUserFromProject(id);
        const projectId = get().activeProjectId;
        if (projectId) {
          try {
            await get().fetchAndSetProject(projectId);
          } catch (error) {
            console.error('Failed to refresh project after removeUser:', error);
          }
        }
      },
    }),
  );