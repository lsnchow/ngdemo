"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { opportunities, users, tasks, evidenceGaps } from "@/lib/mock-data"
import type { Priority, Status } from "@/lib/types"

function getPriorityBadgeVariant(priority: Priority) {
  switch (priority) {
    case "high":
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
    case "medium":
      return "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50"
    case "low":
      return "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50"
  }
}

function getStatusBadgeVariant(status: Status) {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
    case "review":
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
    case "pursuing":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
    case "won":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
    case "lost":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
    case "paused":
      return "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getOwnerName(ownerId: string) {
  const owner = users.find((u) => u.id === ownerId)
  return owner?.name || "Unassigned"
}

function getOpenGapsCount(oppId: string) {
  const gaps = evidenceGaps[oppId] || []
  return gaps.filter((g) => g.status === "open").length
}

function getNextAction(oppId: string) {
  const oppTasks = tasks[oppId] || []
  const nextTask = oppTasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })[0]
  return nextTask
}

export function OpportunityList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter
    const matchesPriority =
      priorityFilter === "all" || opp.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredOpportunities.length} opportunities in pipeline
          </p>
        </div>
        <Button className="gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          Add Opportunity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="pursuing">Pursuing</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 gap-1 text-xs font-medium"
                >
                  Account
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[90px]">Priority</TableHead>
              <TableHead className="w-[120px]">Owner</TableHead>
              <TableHead className="w-[100px]">Last Activity</TableHead>
              <TableHead className="w-[80px]">Gaps</TableHead>
              <TableHead className="w-[180px]">Next Action</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities.map((opp) => {
              const nextAction = getNextAction(opp.id)
              const openGaps = getOpenGapsCount(opp.id)

              return (
                <TableRow
                  key={opp.id}
                  className="group cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/workspace/${opp.id}`}
                      className="hover:underline"
                    >
                      {opp.account_name}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {opp.jurisdiction} · {opp.sector}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/workspace/${opp.id}`}
                      className="hover:underline line-clamp-1"
                    >
                      {opp.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeVariant(opp.status)}
                    >
                      {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPriorityBadgeVariant(opp.priority)}
                    >
                      {opp.priority.charAt(0).toUpperCase() +
                        opp.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getOwnerName(opp.owner_id)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(opp.updated_at)}
                  </TableCell>
                  <TableCell>
                    {openGaps > 0 ? (
                      <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                        {openGaps}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {nextAction ? (
                      <div className="text-sm">
                        <div className="line-clamp-1">{nextAction.title}</div>
                        {nextAction.due_date && (
                          <div className="text-xs text-muted-foreground">
                            Due {formatDate(nextAction.due_date)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No pending actions
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/workspace/${opp.id}`}>
                            Open Workspace
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Generate Brief</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
