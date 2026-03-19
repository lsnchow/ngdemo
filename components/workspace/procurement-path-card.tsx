"use client"

import { Route, Pencil, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CapturePlan, ProcurementPath } from "@/lib/types"

interface ProcurementPathCardProps {
  capturePlan?: CapturePlan
}

const procurementPaths: { value: ProcurementPath; label: string; description: string }[] = [
  {
    value: "renewal",
    label: "Renewal",
    description: "Existing contract up for renewal",
  },
  {
    value: "net_new_buy",
    label: "Net-New Buy",
    description: "New procurement process",
  },
  {
    value: "pilot",
    label: "Pilot",
    description: "Trial or proof of concept",
  },
  {
    value: "cooperative_contract",
    label: "Cooperative",
    description: "Piggyback on existing contract",
  },
  {
    value: "formal_rfp_likely",
    label: "Formal RFP",
    description: "Competitive bid expected",
  },
  {
    value: "unknown",
    label: "Unknown",
    description: "Path not yet determined",
  },
]

export function ProcurementPathCard({ capturePlan }: ProcurementPathCardProps) {
  const selectedPath = capturePlan?.procurement_path || "unknown"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="size-4 text-muted-foreground" />
          Procurement Path
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {procurementPaths.map((path) => {
            const isSelected = selectedPath === path.value
            return (
              <button
                key={path.value}
                className={cn(
                  "relative flex flex-col items-start p-3 rounded-lg border text-left transition-colors",
                  isSelected
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30 hover:bg-muted/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="size-3.5 text-foreground" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {path.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {path.description}
                </span>
              </button>
            )
          })}
        </div>

        {capturePlan && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">
                {Math.round(capturePlan.confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
