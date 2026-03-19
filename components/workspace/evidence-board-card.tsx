"use client"

import { FileText, ExternalLink, Plus, AlertTriangle, Clock, DollarSign, Building, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Evidence, EvidenceCategory, Priority } from "@/lib/types"

interface EvidenceBoardCardProps {
  evidence: Evidence[]
}

const categoryConfig: Record<EvidenceCategory, { label: string; icon: typeof AlertTriangle }> = {
  pain: { label: "Pain Signals", icon: AlertTriangle },
  timing: { label: "Timing Signals", icon: Clock },
  budget: { label: "Budget Signals", icon: DollarSign },
  vendor: { label: "Vendor/Incumbent", icon: Building },
  procurement: { label: "Procurement", icon: ShoppingCart },
}

function getImportanceBadgeClass(importance: Priority) {
  switch (importance) {
    case "high":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "medium":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "low":
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

function groupEvidenceByCategory(evidence: Evidence[]) {
  return evidence.reduce(
    (acc, ev) => {
      if (!acc[ev.category]) {
        acc[ev.category] = []
      }
      acc[ev.category].push(ev)
      return acc
    },
    {} as Record<EvidenceCategory, Evidence[]>
  )
}

export function EvidenceBoardCard({ evidence }: EvidenceBoardCardProps) {
  const groupedEvidence = groupEvidenceByCategory(evidence)
  const categories = Object.keys(categoryConfig) as EvidenceCategory[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-4 text-muted-foreground" />
          Evidence Board
          <Badge variant="secondary" className="ml-1 text-xs">
            {evidence.length}
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
        {evidence.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No evidence collected yet
            </p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Evidence
            </Button>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={["pain", "timing"]} className="space-y-2">
            {categories.map((category) => {
              const items = groupedEvidence[category] || []
              const config = categoryConfig[category]
              const Icon = config.icon

              if (items.length === 0) return null

              return (
                <AccordionItem
                  key={category}
                  value={category}
                  className="border rounded-lg px-3"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{config.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ({items.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg bg-muted/50 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium truncate">
                                  {item.source_title}
                                </span>
                                {item.source_url && (
                                  <a
                                    href={item.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <ExternalLink className="size-3" />
                                  </a>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.excerpt}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={getImportanceBadgeClass(item.importance)}
                            >
                              {item.importance}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{item.source_type.replace("_", " ")}</span>
                            <span>
                              {new Date(item.date_observed).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span>Confidence</span>
                              <Progress
                                value={item.confidence * 100}
                                className="w-12 h-1"
                              />
                              <span>{Math.round(item.confidence * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
