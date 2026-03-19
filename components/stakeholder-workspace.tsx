"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  UserCircle,
  Building2,
  Mail,
  MessageCircle,
  Star,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { stakeholders, opportunities } from "@/lib/mock-data"
import type { StakeholderRole, EngagementStatus } from "@/lib/types"

const roleConfig: Record<StakeholderRole, { label: string; color: string }> = {
  champion: { label: "Champion", color: "bg-emerald-100 text-emerald-700" },
  economic_buyer: { label: "Economic Buyer", color: "bg-blue-100 text-blue-700" },
  evaluator: { label: "Evaluator", color: "bg-purple-100 text-purple-700" },
  gatekeeper: { label: "Gatekeeper", color: "bg-amber-100 text-amber-700" },
  procurement: { label: "Procurement", color: "bg-slate-100 text-slate-700" },
  unknown: { label: "Unknown", color: "bg-gray-100 text-gray-600" },
}

const engagementConfig: Record<EngagementStatus, { label: string; icon: typeof Mail }> = {
  not_contacted: { label: "Not Contacted", icon: Mail },
  contacted: { label: "Contacted", icon: MessageCircle },
  engaged: { label: "Engaged", icon: Star },
  champion: { label: "Champion", icon: Star },
}

// Flatten all stakeholders across opportunities
const allStakeholders = Object.entries(stakeholders).flatMap(([oppId, stks]) =>
  stks.map((stk) => ({
    ...stk,
    opportunity: opportunities.find((o) => o.id === oppId),
  }))
)

export function StakeholderWorkspace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "cards" | "swimlane">("cards")

  const filteredStakeholders = allStakeholders.filter((stk) => {
    const matchesSearch =
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || stk.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Group by role for swimlane view
  const stakeholdersByRole = Object.keys(roleConfig).reduce(
    (acc, role) => {
      acc[role as StakeholderRole] = filteredStakeholders.filter(
        (s) => s.role === role
      )
      return acc
    },
    {} as Record<StakeholderRole, typeof filteredStakeholders>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stakeholders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allStakeholders.length} stakeholders across all opportunities
          </p>
        </div>
        <Button className="gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          Add Stakeholder
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stakeholders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(roleConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="swimlane">Swimlane</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStakeholders.map((stakeholder) => {
            const role = roleConfig[stakeholder.role]
            const engagement = engagementConfig[stakeholder.engagement_status]
            const EngagementIcon = engagement.icon

            return (
              <Card key={stakeholder.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserCircle className="size-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium truncate">{stakeholder.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {stakeholder.title}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", role.color)}
                        >
                          {role.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs gap-1">
                          <EngagementIcon className="size-3" />
                          {engagement.label}
                        </Badge>
                      </div>

                      {stakeholder.opportunity && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building2 className="size-3" />
                          <span className="truncate">
                            {stakeholder.opportunity.account_name}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <Progress
                          value={stakeholder.confidence * 100}
                          className="flex-1 h-1.5"
                        />
                        <span className="text-muted-foreground">
                          {Math.round(stakeholder.confidence * 100)}%
                        </span>
                      </div>

                      {stakeholder.notes && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {stakeholder.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {viewMode === "swimlane" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(Object.entries(roleConfig) as [StakeholderRole, { label: string; color: string }][]).map(
            ([role, config]) => {
              const roleStakeholders = stakeholdersByRole[role]
              if (roleStakeholders.length === 0) return null

              return (
                <div key={role} className="flex-shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className={cn("text-xs", config.color)}>
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({roleStakeholders.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {roleStakeholders.map((stakeholder) => {
                      const engagement = engagementConfig[stakeholder.engagement_status]
                      const EngagementIcon = engagement.icon

                      return (
                        <Card key={stakeholder.id} className="group">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <UserCircle className="size-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">
                                  {stakeholder.name}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {stakeholder.title}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                  <EngagementIcon className="size-3" />
                                  <span>{engagement.label}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}
