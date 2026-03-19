"use client"

import { AlertCircle, CheckCircle2, Circle, Plus, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EvidenceGap, User as UserType, GapSeverity } from "@/lib/types"

interface GapChecklistCardProps {
  gaps: EvidenceGap[]
  users: UserType[]
}

function getSeverityConfig(severity: GapSeverity) {
  switch (severity) {
    case "high":
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      }
    case "medium":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      }
    case "low":
      return {
        badge: "bg-slate-50 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
      }
  }
}

export function GapChecklistCard({ gaps, users }: GapChecklistCardProps) {
  const openGaps = gaps.filter((g) => g.status === "open")
  const resolvedGaps = gaps.filter((g) => g.status === "resolved")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="size-4 text-muted-foreground" />
          Evidence Gaps
          {openGaps.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs bg-amber-50 text-amber-700">
              {openGaps.length} open
            </Badge>
          )}
        </CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Plus className="size-3" />
            Add
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {gaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="size-6 text-emerald-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              No evidence gaps identified
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Open Gaps */}
            {openGaps.map((gap) => {
              const owner = users.find((u) => u.id === gap.owner_id)
              const severityConfig = getSeverityConfig(gap.severity)

              return (
                <div
                  key={gap.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <button className="mt-0.5 shrink-0">
                    <Circle className="size-4 text-muted-foreground" />
                  </button>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">{gap.title}</span>
                      <Badge variant="outline" className={severityConfig.badge}>
                        {gap.severity}
                      </Badge>
                    </div>
                    {gap.suggested_action && (
                      <p className="text-xs text-muted-foreground">
                        {gap.suggested_action}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {owner && (
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          {owner.name}
                        </span>
                      )}
                      {gap.due_date && (
                        <span>
                          Due{" "}
                          {new Date(gap.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Resolved Gaps */}
            {resolvedGaps.length > 0 && (
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Resolved ({resolvedGaps.length})
                </div>
                {resolvedGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="flex items-center gap-3 py-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span className="line-through">{gap.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
