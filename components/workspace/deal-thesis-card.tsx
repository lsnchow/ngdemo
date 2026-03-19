"use client"

import { Lightbulb, Pencil, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { CapturePlan } from "@/lib/types"

interface DealThesisCardProps {
  capturePlan?: CapturePlan
}

function getRecommendationBadge(rec: string) {
  switch (rec) {
    case "pursue":
      return {
        icon: ThumbsUp,
        label: "Pursue",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }
    case "no_pursue":
      return {
        icon: ThumbsDown,
        label: "Do Not Pursue",
        className: "bg-red-50 text-red-700 border-red-200",
      }
    default:
      return {
        icon: HelpCircle,
        label: "Needs Research",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      }
  }
}

export function DealThesisCard({ capturePlan }: DealThesisCardProps) {
  if (!capturePlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-4 text-muted-foreground" />
            Deal Thesis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Lightbulb className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No capture plan generated yet
            </p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="size-3.5" />
              Generate Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const recommendation = getRecommendationBadge(capturePlan.pursue_recommendation)
  const RecommendationIcon = recommendation.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="size-4 text-muted-foreground" />
          Deal Thesis
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Recommendation + Confidence */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={recommendation.className}>
            <RecommendationIcon className="size-3 mr-1" />
            {recommendation.label}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <div className="flex items-center gap-2">
              <Progress value={capturePlan.confidence * 100} className="w-16 h-1.5" />
              <span className="text-xs font-medium">
                {Math.round(capturePlan.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Thesis */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Thesis
          </h4>
          <p className="text-sm leading-relaxed">{capturePlan.deal_thesis}</p>
        </div>

        {/* Why Now */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Why Now
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {capturePlan.why_now}
          </p>
        </div>

        {/* Our Angle */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Our Angle
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {capturePlan.our_angle}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Last generated:{" "}
            {new Date(capturePlan.last_generated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
            <RefreshCw className="size-3" />
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
