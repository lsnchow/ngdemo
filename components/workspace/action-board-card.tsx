"use client"

import { CheckSquare, Plus, Circle, Clock, CheckCircle2, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus, Priority, User as UserType } from "@/lib/types"

interface ActionBoardCardProps {
  tasks: Task[]
  users: UserType[]
}

function getPriorityDot(priority: Priority) {
  switch (priority) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-amber-500"
    case "low":
      return "bg-slate-400"
  }
}

function getStatusIcon(status: TaskStatus) {
  switch (status) {
    case "todo":
      return Circle
    case "in_progress":
      return Clock
    case "done":
      return CheckCircle2
  }
}

function formatDueDate(dateString?: string) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: "Overdue", className: "text-red-600" }
  } else if (diffDays === 0) {
    return { text: "Today", className: "text-amber-600" }
  } else if (diffDays === 1) {
    return { text: "Tomorrow", className: "text-amber-600" }
  } else if (diffDays <= 7) {
    return { text: `${diffDays}d`, className: "text-muted-foreground" }
  } else {
    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      className: "text-muted-foreground",
    }
  }
}

export function ActionBoardCard({ tasks, users }: ActionBoardCardProps) {
  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  const TaskItem = ({ task }: { task: Task }) => {
    const owner = users.find((u) => u.id === task.owner_id)
    const StatusIcon = getStatusIcon(task.status)
    const dueInfo = formatDueDate(task.due_date)

    return (
      <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
        <button className="mt-0.5 shrink-0">
          <StatusIcon
            className={cn(
              "size-4",
              task.status === "done" ? "text-emerald-600" : "text-muted-foreground"
            )}
          />
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm leading-tight",
              task.status === "done" && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <div
              className={cn("size-1.5 rounded-full", getPriorityDot(task.priority))}
            />
            {owner && (
              <span className="flex items-center gap-0.5">
                <User className="size-2.5" />
                {owner.name.split(" ")[0]}
              </span>
            )}
            {dueInfo && (
              <span className={dueInfo.className}>{dueInfo.text}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckSquare className="size-4 text-muted-foreground" />
          Actions
          <Badge variant="secondary" className="ml-1 text-xs">
            {tasks.filter((t) => t.status !== "done").length}
          </Badge>
        </CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Plus className="size-3" />
            Add
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <CheckSquare className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No actions created yet
            </p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Action
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full mb-3">
              <TabsTrigger value="active" className="flex-1">
                Active ({todoTasks.length + inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger value="done" className="flex-1">
                Done ({doneTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              <div className="space-y-1">
                {inProgressTasks.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1 px-2">
                      In Progress
                    </div>
                    {inProgressTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
                {todoTasks.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1 px-2">
                      To Do
                    </div>
                    {todoTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                )}
                {todoTasks.length === 0 && inProgressTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All tasks completed
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="done" className="mt-0">
              <div className="space-y-1">
                {doneTasks.length > 0 ? (
                  doneTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No completed tasks yet
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
