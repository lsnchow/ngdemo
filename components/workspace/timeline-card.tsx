"use client"

import {
  Clock,
  MessageSquare,
  Sparkles,
  RefreshCw,
  FileOutput,
  Edit,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ActivityLog, User } from "@/lib/types"

interface TimelineCardProps {
  logs: ActivityLog[]
  users: User[]
}

const logTypeConfig: Record<
  ActivityLog["type"],
  { icon: typeof MessageSquare; color: string }
> = {
  note: { icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
  ai_generated: { icon: Sparkles, color: "text-purple-600 bg-purple-50" },
  status_change: { icon: RefreshCw, color: "text-amber-600 bg-amber-50" },
  export: { icon: FileOutput, color: "text-emerald-600 bg-emerald-50" },
  update: { icon: Edit, color: "text-slate-600 bg-slate-50" },
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function TimelineCard({ logs, users }: TimelineCardProps) {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="size-4 text-muted-foreground" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet
          </p>
        ) : (
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />

            {sortedLogs.map((log, index) => {
              const config = logTypeConfig[log.type]
              const Icon = config.icon
              const user = users.find((u) => u.id === log.user_id)

              return (
                <div key={log.id} className="relative flex gap-3 pl-1">
                  <div
                    className={cn(
                      "relative z-10 size-6 rounded-full flex items-center justify-center shrink-0",
                      config.color
                    )}
                  >
                    <Icon className="size-3" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm leading-relaxed">{log.content}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {user && <span>{user.name}</span>}
                      {user && <span>·</span>}
                      <span>{formatRelativeTime(log.created_at)}</span>
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
