"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  Circle,
  Clock,
  CheckCircle2,
  User,
  Building2,
  MoreHorizontal,
  GripVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { tasks, opportunities, users } from "@/lib/mock-data"
import type { TaskStatus, Priority } from "@/lib/types"

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

function formatDueDate(dateString?: string) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: "Overdue", className: "text-red-600 bg-red-50" }
  } else if (diffDays === 0) {
    return { text: "Today", className: "text-amber-600 bg-amber-50" }
  } else if (diffDays === 1) {
    return { text: "Tomorrow", className: "text-amber-600 bg-amber-50" }
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days`, className: "text-muted-foreground bg-muted" }
  } else {
    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      className: "text-muted-foreground bg-muted",
    }
  }
}

// Flatten all tasks across opportunities
const allTasks = Object.entries(tasks).flatMap(([oppId, tsks]) =>
  tsks.map((tsk) => ({
    ...tsk,
    opportunity: opportunities.find((o) => o.id === oppId),
  }))
)

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle }> = {
  todo: { label: "To Do", icon: Circle },
  in_progress: { label: "In Progress", icon: Clock },
  done: { label: "Done", icon: CheckCircle2 },
}

export function ActionsWorkspace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")

  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesOwner = ownerFilter === "all" || task.owner_id === ownerFilter
    return matchesSearch && matchesStatus && matchesOwner
  })

  // Group by status for kanban
  const tasksByStatus = (Object.keys(statusConfig) as TaskStatus[]).reduce(
    (acc, status) => {
      acc[status] = filteredTasks.filter((t) => t.status === status)
      return acc
    },
    {} as Record<TaskStatus, typeof filteredTasks>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Actions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTasks.filter((t) => t.status !== "done").length} pending actions
          </p>
        </div>
        <Button className="gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          Add Action
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.entries(statusConfig) as [TaskStatus, { label: string; icon: typeof Circle }][]).map(
          ([status, config]) => {
            const statusTasks = tasksByStatus[status]
            const Icon = config.icon

            return (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={cn(
                          "size-4",
                          status === "done"
                            ? "text-emerald-600"
                            : status === "in_progress"
                              ? "text-blue-600"
                              : "text-muted-foreground"
                        )}
                      />
                      {config.label}
                      <Badge variant="secondary" className="text-xs">
                        {statusTasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="size-7">
                      <Plus className="size-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {statusTasks.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No tasks
                      </div>
                    ) : (
                      statusTasks.map((task) => {
                        const owner = users.find((u) => u.id === task.owner_id)
                        const dueInfo = formatDueDate(task.due_date)

                        return (
                          <div
                            key={task.id}
                            className="group p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-2">
                              <GripVertical className="size-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 cursor-grab" />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-sm leading-tight",
                                    status === "done" &&
                                      "text-muted-foreground line-through"
                                  )}
                                >
                                  {task.title}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <div
                                    className={cn(
                                      "size-2 rounded-full",
                                      getPriorityDot(task.priority)
                                    )}
                                  />
                                  {owner && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="size-3" />
                                      {owner.name.split(" ")[0]}
                                    </span>
                                  )}
                                  {dueInfo && (
                                    <Badge
                                      variant="secondary"
                                      className={cn("text-[10px] px-1.5", dueInfo.className)}
                                    >
                                      {dueInfo.text}
                                    </Badge>
                                  )}
                                </div>

                                {task.opportunity && (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                    <Building2 className="size-3" />
                                    <span className="truncate">
                                      {task.opportunity.account_name}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Change Owner</DropdownMenuItem>
                                  <DropdownMenuItem>Move to In Progress</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Done</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>
    </div>
  )
}
