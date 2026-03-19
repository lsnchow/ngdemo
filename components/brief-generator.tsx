"use client"

import { useState } from "react"
import {
  FileText,
  MessageSquare,
  Mail,
  Presentation,
  ClipboardList,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  ChevronRight,
  Building2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { opportunities, capturePlans, stakeholders, evidenceGaps, evidence } from "@/lib/mock-data"

const briefTemplates = [
  {
    id: "exec",
    label: "Executive Brief",
    description: "High-level summary for leadership",
    icon: FileText,
  },
  {
    id: "manager",
    label: "Manager Review",
    description: "Detailed brief for sales manager",
    icon: ClipboardList,
  },
  {
    id: "battlecard",
    label: "AE Battlecard",
    description: "Quick reference for account exec",
    icon: Presentation,
  },
  {
    id: "meeting_prep",
    label: "Meeting Prep",
    description: "Talking points and context",
    icon: MessageSquare,
  },
  {
    id: "slack",
    label: "Slack Summary",
    description: "Concise team update",
    icon: MessageSquare,
  },
  {
    id: "crm",
    label: "CRM Note",
    description: "Structured CRM entry",
    icon: Mail,
  },
]

// Sample generated brief content
const sampleBrief = `## Executive Brief: North Valley School District

**Opportunity:** Student Transportation Modernization  
**Status:** Review | **Priority:** High  
**Owner:** Sarah Chen

---

### Deal Thesis
North Valley School District is experiencing significant operational pain in transportation management, with documented inefficiencies in routing and ongoing driver shortages. Their strategic plan prioritizes modernization in Q2, creating a strong timing alignment with our solution.

### Why Now
- Contract with legacy provider expires August 2026
- Strategic plan identifies Q2 as priority window
- Board has actively discussed pain points in recent meetings

### Our Angle
Our route optimization platform directly addresses their core pain points: routing inefficiency and resource allocation. Strong K-12 references in California strengthen our position.

### Key Stakeholders
- **Dr. Maria Santos** (Director of Transportation) - Champion candidate, highly engaged
- **Robert Chen** (CFO) - Economic buyer, budget approval authority
- **Jennifer Wu** (IT Director) - Technical evaluator, not yet contacted

### Evidence Gaps
- [ ] Budget approval not confirmed (High)
- [ ] Technical requirements unclear (Medium)
- [ ] Decision timeline unknown (Medium)

### Recommended Next Steps
1. Confirm budget allocation with CFO (Due: Mar 25)
2. Schedule technical discovery with IT Director
3. Research competitor implementations in K-12

---

*Generated on Mar 19, 2026 | Confidence: 76%*`

export function BriefGenerator() {
  const [selectedOpportunity, setSelectedOpportunity] = useState(opportunities[0].id)
  const [selectedTemplate, setSelectedTemplate] = useState("exec")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null)

  // Options
  const [includeEvidence, setIncludeEvidence] = useState(true)
  const [includeRisks, setIncludeRisks] = useState(true)
  const [includeStakeholders, setIncludeStakeholders] = useState(true)
  const [includeActions, setIncludeActions] = useState(true)

  const selectedOpp = opportunities.find((o) => o.id === selectedOpportunity)
  const hasPlan = capturePlans[selectedOpportunity]

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedBrief(sampleBrief)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Brief Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate polished internal briefs from capture plans
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Opportunity Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Select Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedOpportunity}
                onValueChange={setSelectedOpportunity}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opportunities.map((opp) => (
                    <SelectItem key={opp.id} value={opp.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <span>{opp.account_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedOpp && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium">{selectedOpp.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedOpp.jurisdiction} · {selectedOpp.sector}
                  </div>
                  {!hasPlan && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <Sparkles className="size-3" />
                      No capture plan yet - generate one first
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Brief Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {briefTemplates.map((template) => {
                const Icon = template.icon
                const isSelected = selectedTemplate === template.id

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                      isSelected
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <div
                      className={cn(
                        "size-8 rounded-lg flex items-center justify-center",
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium",
                          !isSelected && "text-muted-foreground"
                        )}
                      >
                        {template.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Include Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="evidence"
                  checked={includeEvidence}
                  onCheckedChange={(c) => setIncludeEvidence(c === true)}
                />
                <Label htmlFor="evidence" className="text-sm">
                  Key Evidence
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="risks"
                  checked={includeRisks}
                  onCheckedChange={(c) => setIncludeRisks(c === true)}
                />
                <Label htmlFor="risks" className="text-sm">
                  Risks & Gaps
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="stakeholders"
                  checked={includeStakeholders}
                  onCheckedChange={(c) => setIncludeStakeholders(c === true)}
                />
                <Label htmlFor="stakeholders" className="text-sm">
                  Stakeholder Map
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="actions"
                  checked={includeActions}
                  onCheckedChange={(c) => setIncludeActions(c === true)}
                />
                <Label htmlFor="actions" className="text-sm">
                  Next Actions
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !hasPlan}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Spinner className="size-4" />
                Generating Brief...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Brief
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Brief Preview</CardTitle>
            {generatedBrief && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <RefreshCw className="size-3.5" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Copy className="size-3.5" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="size-3.5" />
                  Export
                </Button>
              </div>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {!generatedBrief ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No Brief Generated</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select an opportunity and template, then click Generate Brief to
                  create a polished internal document.
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="p-6 rounded-xl border bg-card">
                  {generatedBrief.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={i} className="text-lg font-semibold mt-0 mb-4">
                          {line.replace("## ", "")}
                        </h2>
                      )
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3 key={i} className="text-sm font-semibold text-foreground mt-6 mb-2">
                          {line.replace("### ", "")}
                        </h3>
                      )
                    }
                    if (line.startsWith("**") && line.includes(":**")) {
                      const [label, ...rest] = line.split(":**")
                      return (
                        <p key={i} className="text-sm mb-1">
                          <strong>{label.replace("**", "")}:</strong>
                          {rest.join(":**")}
                        </p>
                      )
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="text-sm text-muted-foreground ml-4">
                          {line.replace("- ", "")}
                        </li>
                      )
                    }
                    if (line.startsWith("- [ ]") || line.startsWith("- [x]")) {
                      const checked = line.startsWith("- [x]")
                      const text = line.replace(/- \[.\] /, "")
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm ml-4 my-1">
                          <Checkbox checked={checked} disabled />
                          <span className={checked ? "line-through text-muted-foreground" : ""}>
                            {text}
                          </span>
                        </div>
                      )
                    }
                    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                      return (
                        <li key={i} className="text-sm text-muted-foreground ml-4 list-decimal">
                          {line.replace(/^\d\. /, "")}
                        </li>
                      )
                    }
                    if (line === "---") {
                      return <Separator key={i} className="my-4" />
                    }
                    if (line.startsWith("*") && line.endsWith("*")) {
                      return (
                        <p key={i} className="text-xs text-muted-foreground italic mt-4">
                          {line.replace(/\*/g, "")}
                        </p>
                      )
                    }
                    if (line.trim() === "") {
                      return <div key={i} className="h-2" />
                    }
                    return (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                        {line}
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
