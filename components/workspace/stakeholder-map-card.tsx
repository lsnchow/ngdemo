"use client"

import { Users, Plus, UserCircle, MessageCircle, Mail, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Stakeholder, StakeholderRole, EngagementStatus, User } from "@/lib/types"

interface StakeholderMapCardProps {
  stakeholders: Stakeholder[]
  users: User[]
}

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

export function StakeholderMapCard({ stakeholders }: StakeholderMapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4 text-muted-foreground" />
          Stakeholders
          <Badge variant="secondary" className="ml-1 text-xs">
            {stakeholders.length}
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
        {stakeholders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No stakeholders mapped yet
            </p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Stakeholder
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {stakeholders.map((stakeholder) => {
              const role = roleConfig[stakeholder.role]
              const engagement = engagementConfig[stakeholder.engagement_status]
              const EngagementIcon = engagement.icon

              return (
                <div
                  key={stakeholder.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserCircle className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium truncate">
                            {stakeholder.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {stakeholder.title}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs shrink-0", role.color)}
                        >
                          {role.label}
                        </Badge>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <EngagementIcon className="size-3" />
                          <span>{engagement.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Confidence</span>
                          <Progress
                            value={stakeholder.confidence * 100}
                            className="w-10 h-1"
                          />
                          <span className="text-muted-foreground">
                            {Math.round(stakeholder.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {stakeholder.notes && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {stakeholder.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
