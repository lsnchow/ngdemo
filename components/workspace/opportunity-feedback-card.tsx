"use client"

import { useMemo, useState } from "react"
import {
  MessageSquarePlus,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createFeedbackLearningSummary,
  getFeedbackRatingLabel,
  getFeedbackReasonOptions,
  type OpportunityFeedbackEntry,
  type OpportunityFeedbackRating,
  type OpportunityFeedbackReasonId,
} from "@/lib/workspace/opportunity-feedback"
import { cn } from "@/lib/utils"

const ratingConfig: Record<
  OpportunityFeedbackRating,
  {
    label: string
    icon: typeof ThumbsUp
    selectedClassName: string
  }
> = {
  strong: {
    label: "Strong",
    icon: ThumbsUp,
    selectedClassName: "border-primary bg-primary/10 text-primary",
  },
  medium: {
    label: "Medium",
    icon: TriangleAlert,
    selectedClassName: "border-primary bg-primary/10 text-primary",
  },
  weak: {
    label: "Weak",
    icon: ThumbsDown,
    selectedClassName: "border-primary bg-primary/10 text-primary",
  },
}

export function OpportunityFeedbackCard({
  opportunityId,
}: {
  opportunityId: string
}) {
  const [draft, setDraft] = useState<OpportunityFeedbackEntry | null>(null)
  const [savedFeedback, setSavedFeedback] =
    useState<OpportunityFeedbackEntry | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const selectedRating = draft?.rating
  const reasonOptions = useMemo(
    () => (selectedRating ? getFeedbackReasonOptions(selectedRating) : []),
    [selectedRating]
  )

  function updateDraft(next: Partial<OpportunityFeedbackEntry>) {
    setDraft((current) => ({
      rating: current?.rating ?? "medium",
      reasons: current?.reasons ?? [],
      otherReason: current?.otherReason ?? "",
      notes: current?.notes ?? "",
      ...current,
      ...next,
    }))
  }

  function handleSelectRating(rating: OpportunityFeedbackRating) {
    setDraft({
      rating,
      reasons: [],
      otherReason: "",
      notes: draft?.notes ?? "",
    })
    setIsExpanded(true)
  }

  function toggleReason(reasonId: OpportunityFeedbackReasonId) {
    const currentReasons = draft?.reasons ?? []
    const nextReasons = currentReasons.includes(reasonId)
      ? currentReasons.filter((reason) => reason !== reasonId)
      : [...currentReasons, reasonId]

    updateDraft({ reasons: nextReasons })
  }

  function handleSave() {
    if (!draft) {
      return
    }

    setSavedFeedback(draft)
    setIsExpanded(false)
  }

  const summaryReasons = savedFeedback?.reasons
    .map((reason) =>
      getFeedbackReasonOptions(savedFeedback.rating).find((option) => option.id === reason)
    )
    .filter(Boolean)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base text-balance">
          <MessageSquarePlus className="size-4 text-muted-foreground" />
          Opportunity Feedback
        </CardTitle>
        <CardDescription className="text-pretty">
          Rate this opportunity and show NationGraph what strong or weak pipeline
          signals look like for your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {savedFeedback && !isExpanded ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {getFeedbackRatingLabel(savedFeedback.rating)}
                  </Badge>
                  {summaryReasons?.slice(0, 2).map((reason) => (
                    <Badge key={reason?.id} variant="outline">
                      {reason?.label}
                    </Badge>
                  ))}
                </div>
                {savedFeedback.notes ? (
                  <p className="text-sm text-muted-foreground text-pretty">
                    {savedFeedback.notes}
                  </p>
                ) : null}
                <p className="text-sm text-muted-foreground text-pretty">
                  {createFeedbackLearningSummary(
                    savedFeedback.rating,
                    savedFeedback.reasons
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 self-start"
                onClick={() => setIsExpanded(true)}
              >
                <Pencil className="size-4" />
                Edit Feedback
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium">Rate this opportunity</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Object.entries(ratingConfig) as [
                  OpportunityFeedbackRating,
                  (typeof ratingConfig)[OpportunityFeedbackRating],
                ][]).map(([rating, config]) => {
                  const Icon = config.icon
                  const isSelected = selectedRating === rating

                  return (
                    <Button
                      key={rating}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-auto justify-start gap-3 px-4 py-3",
                        isSelected && config.selectedClassName
                      )}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectRating(rating)}
                    >
                      <Icon className="size-4" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {selectedRating ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-medium">Why?</p>
                  <div className="flex flex-wrap gap-2">
                    {reasonOptions.map((option) => {
                      const selected = draft?.reasons.includes(option.id) ?? false

                      return (
                        <Button
                          key={option.id}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          className="h-auto whitespace-normal text-left text-pretty"
                          aria-pressed={selected}
                          onClick={() => toggleReason(option.id)}
                        >
                          {option.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`feedback-other-${opportunityId}`}>
                      Other reason
                    </Label>
                    <Input
                      id={`feedback-other-${opportunityId}`}
                      placeholder="Add another reason..."
                      value={draft?.otherReason ?? ""}
                      onChange={(event) =>
                        updateDraft({ otherReason: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`feedback-notes-${opportunityId}`}>Notes</Label>
                    <Textarea
                      id={`feedback-notes-${opportunityId}`}
                      placeholder="Seems good but missing vendor info"
                      className="min-h-24 text-sm text-pretty"
                      value={draft?.notes ?? ""}
                      onChange={(event) => updateDraft({ notes: event.target.value })}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    What this teaches NationGraph
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">
                    {createFeedbackLearningSummary(
                      selectedRating,
                      draft?.reasons ?? []
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" onClick={handleSave}>
                    Save Feedback
                  </Button>
                  {savedFeedback ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsExpanded(false)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
