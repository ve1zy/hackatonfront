"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Calendar, Tag, GripVertical } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useProjectStore, TaskPriority, ColumnType } from "@/store/project-store";
import { useAuthStore } from "@/store/auth-store";
import { DragDropContext, DropResult, Droppable, Draggable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

const COLUMNS: { id: ColumnType; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/50" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/50" },
];

export default function TasksPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { projects, activeProjectId, setActiveProject, addTask, deleteTask, updateTask, moveTask } = useProjectStore();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");

  const resetForm = useCallback(() => {
    setNewTitle("");
    setNewDescription("");
    setPriority("medium");
    setAssigneeId("unassigned");
    setDueDate("");
    setTags("");
  }, []);

  const handleAddTask = async () => {
    if (!project) return;
    if (newTitle.trim()) {
      await addTask({
        columnId: "backlog",
        title: newTitle,
        description: newDescription,
        priority,
        assigneeId: assigneeId === "unassigned" ? undefined : assigneeId,
      }, user?.id);
      resetForm();
      setOpen(false);
    }
  };

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  }, [resetForm]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId !== source.droppableId) {
      moveTask(draggableId, destination.droppableId as ColumnType);
    }
  }, [moveTask]);

  const tasksByColumn = useMemo(() => {
    if (!project) return { backlog: [], "in-progress": [], done: [] };
    const result: Record<ColumnType, typeof project.tasks> = {
      backlog: [],
      "in-progress": [],
      done: [],
    };
    project.tasks.forEach((task) => {
      if (task.columnId in result) {
        result[task.columnId as ColumnType].push(task);
      }
    });
    return result;
  }, [project]);

  if (!project) return <div>No project selected</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tasks Board</h2>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Add a new task to the project</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {project.users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <button
                onClick={handleAddTask}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Create
              </button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className={`p-3 rounded-t-lg ${column.color}`}>
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm text-muted-foreground">{tasksByColumn[column.id].length} tasks</span>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 min-h-[200px] bg-slate-50 dark:bg-slate-900/50 rounded-b-lg p-2 space-y-2"
                  >
                    {tasksByColumn[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...(provided.draggableProps as object)}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border"
                          >
                            <TaskItem task={task} onDelete={() => deleteTask(task.id)} onUpdate={(data) => updateTask(task.id, data)} users={project.users} dragHandleProps={provided.dragHandleProps || undefined} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

interface TaskItemProps {
  task: { id: string; title: string; description: string; priority: TaskPriority; dueDate?: string; completedAt?: string; tags: string[]; assigneeId?: string };
  onDelete: () => void;
  onUpdate: (data: Partial<{ title: string; description: string; priority: TaskPriority; assigneeId?: string; completedAt?: string }>) => Promise<void>;
  users: { id: string; name: string }[];
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

function TaskItem({ task, onDelete, onUpdate, users, dragHandleProps }: TaskItemProps) {
  const assignee = users.find((u) => u.id === task.assigneeId);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          <div className="flex gap-1">
            <button 
              {...(dragHandleProps as object)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-grab"
            >
              <GripVertical className="h-3 w-3" />
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Edit className="h-3 w-3" />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Priority: {task.priority}</span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {assignee && (
              <span className="text-muted-foreground">Assignee: {assignee.name}</span>
            )}
            {task.tags && task.tags.length > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Tag className="h-3 w-3" /> {task.tags.join(", ")}
              </span>
            )}
          </div>
          <Checkbox
            checked={!!task.completedAt}
            onCheckedChange={(checked) => onUpdate({ completedAt: checked ? new Date().toISOString() : undefined })}
          />
        </div>
      </CardContent>
    </Card>
  );
}