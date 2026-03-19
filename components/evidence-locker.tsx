"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  Upload,
  ExternalLink,
  Building2,
  AlertTriangle,
  Clock,
  DollarSign,
  Building,
  ShoppingCart,
  Pin,
  MoreHorizontal,
  FileText,
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
import { cn } from "@/lib/utils"
import { evidence, opportunities } from "@/lib/mock-data"
import type { EvidenceCategory, Priority } from "@/lib/types"

const categoryConfig: Record<
  EvidenceCategory,
  { label: string; icon: typeof AlertTriangle; color: string }
> = {
  pain: { label: "Pain Signals", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  timing: { label: "Timing Signals", icon: Clock, color: "text-blue-600 bg-blue-50" },
  budget: { label: "Budget Signals", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
  vendor: { label: "Vendor/Incumbent", icon: Building, color: "text-purple-600 bg-purple-50" },
  procurement: { label: "Procurement", icon: ShoppingCart, color: "text-amber-600 bg-amber-50" },
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

// Flatten all evidence across opportunities
const allEvidence = Object.entries(evidence).flatMap(([oppId, evs]) =>
  evs.map((ev) => ({
    ...ev,
    opportunity: opportunities.find((o) => o.id === oppId),
  }))
)

export function EvidenceLocker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")

  const filteredEvidence = allEvidence.filter((ev) => {
    const matchesSearch =
      ev.source_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || ev.category === categoryFilter
    const matchesImportance = importanceFilter === "all" || ev.importance === importanceFilter
    return matchesSearch && matchesCategory && matchesImportance
  })

  // Group by category
  const evidenceByCategory = (Object.keys(categoryConfig) as EvidenceCategory[]).reduce(
    (acc, category) => {
      acc[category] = filteredEvidence.filter((ev) => ev.category === category)
      return acc
    },
    {} as Record<EvidenceCategory, typeof filteredEvidence>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence Locker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allEvidence.length} evidence items collected
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" className="gap-1.5">
            <Upload className="size-4" />
            Upload
          </Button>
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Evidence
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryConfig).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={importanceFilter} onValueChange={setImportanceFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Importance</SelectItem>
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

      {/* Category sections */}
      <div className="space-y-8">
        {(Object.entries(categoryConfig) as [EvidenceCategory, typeof categoryConfig.pain][]).map(
          ([category, config]) => {
            const categoryEvidence = evidenceByCategory[category]
            if (categoryEvidence.length === 0) return null

            const Icon = config.icon

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={cn(
                      "size-7 rounded-lg flex items-center justify-center",
                      config.color
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <h2 className="font-semibold">{config.label}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {categoryEvidence.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryEvidence.map((ev) => (
                    <Card key={ev.id} className="group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="size-4 text-muted-foreground shrink-0" />
                              <h3 className="font-medium truncate">
                                {ev.source_title}
                              </h3>
                              {ev.source_url && (
                                <a
                                  href={ev.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground shrink-0"
                                >
                                  <ExternalLink className="size-3.5" />
                                </a>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {ev.excerpt}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                              <Badge
                                variant="outline"
                                className={getImportanceBadgeClass(ev.importance)}
                              >
                                {ev.importance}
                              </Badge>
                              <span className="text-muted-foreground">
                                {ev.source_type.replace("_", " ")}
                              </span>
                              <span className="text-muted-foreground">
                                {new Date(ev.date_observed).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric", year: "numeric" }
                                )}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Confidence</span>
                              <Progress
                                value={ev.confidence * 100}
                                className="flex-1 h-1.5 max-w-24"
                              />
                              <span className="text-muted-foreground">
                                {Math.round(ev.confidence * 100)}%
                              </span>
                            </div>

                            {ev.opportunity && (
                              <div className="mt-3 pt-3 border-t flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Building2 className="size-3" />
                                <span>{ev.opportunity.account_name}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100"
                            >
                              <Pin className="size-3.5" />
                            </Button>
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
                                <DropdownMenuItem>Pin to Brief</DropdownMenuItem>
                                <DropdownMenuItem>Copy Citation</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
