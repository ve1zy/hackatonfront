"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useState, useMemo, useEffect, use } from "react";
import { useProjectStore, TaskPriority, ColumnType } from "@/store/project-store";
import { DragDropContext, DropResult, Droppable, Draggable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

const COLUMNS: { id: ColumnType; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/50" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/50" },
];

export default function TasksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { projects, activeProjectId, setActiveProject, addTask, deleteTask, moveTask } = useProjectStore();

  useEffect(() => {
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  const project = useMemo(() => projects.find((p) => p.id === activeProjectId), [projects, activeProjectId]);
  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const handleAddTask = () => {
    if (!project) return;
    if (newTitle.trim()) {
      addTask({
        boardId: project.id,
        columnId: "backlog",
        title: newTitle,
        description: "",
        priority,
      });
      setNewTitle("");
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId !== source.droppableId) {
      moveTask(draggableId, destination.droppableId as ColumnType);
    }
  };

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
          <h2 className="text-2xl font-bold">Tasks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </button>
            </DialogTrigger>
            <DialogContent>
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
                <select
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
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
                            {...provided.draggableProps}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border"
                          >
                            <TaskItem task={task} onDelete={() => deleteTask(task.id)} dragHandleProps={provided.dragHandleProps || undefined} />
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
  task: { id: string; title: string; priority: TaskPriority; completedAt?: string };
  onDelete: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

function TaskItem({ task, onDelete, dragHandleProps }: TaskItemProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          <div className="flex gap-1">
            <button
              {...dragHandleProps}
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Priority: {task.priority}</span>
          <Checkbox checked={!!task.completedAt} />
        </div>
      </CardContent>
    </Card>
  );
}