"use client"

import {
  Sparkles,
  FileText,
  MessageSquare,
  Mail,
  Copy,
  Download,
  AlertCircle,
  Users,
  CheckSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Opportunity, Stakeholder, EvidenceGap, Task } from "@/lib/types"

interface CoordinationPanelProps {
  opportunity: Opportunity
  stakeholders: Stakeholder[]
  gaps: EvidenceGap[]
  tasks: Task[]
}

export function CoordinationPanel({
  opportunity,
  stakeholders,
  gaps,
  tasks,
}: CoordinationPanelProps) {
  const openGaps = gaps.filter((g) => g.status === "open")
  const pendingTasks = tasks.filter((t) => t.status !== "done")
  const engagedStakeholders = stakeholders.filter(
    (s) => s.engagement_status === "engaged" || s.engagement_status === "champion"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-muted-foreground" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="size-3" />
            </div>
            <div className="text-lg font-semibold">{stakeholders.length}</div>
            <div className="text-[10px] text-muted-foreground">Stakeholders</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <AlertCircle className="size-3" />
            </div>
            <div className="text-lg font-semibold">{openGaps.length}</div>
            <div className="text-[10px] text-muted-foreground">Open Gaps</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <CheckSquare className="size-3" />
            </div>
            <div className="text-lg font-semibold">{pendingTasks.length}</div>
            <div className="text-[10px] text-muted-foreground">Pending</div>
          </div>
        </div>

        <Separator />

        {/* AI Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Quick Actions
          </h4>
          <div className="space-y-1.5">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <Sparkles className="size-3.5 text-purple-600" />
              Suggest next actions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <AlertCircle className="size-3.5 text-amber-600" />
              Identify missing evidence
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <Users className="size-3.5 text-blue-600" />
              Suggest stakeholder roles
            </Button>
          </div>
        </div>

        <Separator />

        {/* Export Options */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Generate Brief
          </h4>
          <div className="space-y-1.5">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <FileText className="size-3.5" />
              Executive Brief
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <MessageSquare className="size-3.5" />
              Slack Summary
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              <Mail className="size-3.5" />
              Manager Update
            </Button>
          </div>
        </div>

        <Separator />

        {/* Export Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Copy className="size-3.5" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
