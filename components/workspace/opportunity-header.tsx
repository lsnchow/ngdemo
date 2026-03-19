"use client"

import { Mail, Plus, Building2, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Opportunity, Priority, Status } from "@/lib/types"
import { users } from "@/lib/mock-data"

interface OpportunityHeaderProps {
  opportunity: Opportunity
  hasChampion: boolean
  onDraftChampionEmail: () => void
}

function getPriorityBadgeClass(priority: Priority) {
  switch (priority) {
    case "high":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "medium":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "low":
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

function getStatusBadgeClass(status: Status) {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "review":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "pursuing":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "won":
      return "bg-green-50 text-green-700 border-green-200"
    case "lost":
      return "bg-red-50 text-red-700 border-red-200"
    case "paused":
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function OpportunityHeader({
  opportunity,
  hasChampion,
  onDraftChampionEmail,
}: OpportunityHeaderProps) {
  const owner = users.find((u) => u.id === opportunity.owner_id)

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          {/* Account and Title */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Building2 className="size-3.5" />
              <span>{opportunity.account_name}</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              {opportunity.title}
            </h1>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className={getStatusBadgeClass(opportunity.status)}>
              {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={getPriorityBadgeClass(opportunity.priority)}>
              {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)} Priority
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              <span>{opportunity.jurisdiction}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Tag className="size-3.5" />
              <span>{opportunity.sector}</span>
            </div>
          </div>

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {opportunity.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Summary */}
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {opportunity.summary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            onClick={onDraftChampionEmail}
            disabled={!hasChampion}
            className="gap-1.5"
          >
            <Mail className="size-4" />
            Draft Outreach To Champion
          </Button>
          <Button variant="outline" className="gap-1.5">
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Owner info */}
      {owner && (
        <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Owner:</span>
          <span className="font-medium">{owner.name}</span>
          <span className="text-muted-foreground">({owner.role})</span>
        </div>
      )}
    </div>
  )
}
