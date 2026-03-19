export type OpportunityFeedbackRating = "strong" | "medium" | "weak"

export type OpportunityFeedbackReasonId =
  | "budget_signal"
  | "operational_pain"
  | "good_timing"
  | "product_fit"
  | "needs_more_evidence"
  | "interesting_but_incomplete"
  | "unclear_buying_committee"
  | "timing_not_confirmed"
  | "no_budget"
  | "weak_signal"
  | "wrong_stakeholder"
  | "unclear_timing"

export interface OpportunityFeedbackReasonOption {
  id: OpportunityFeedbackReasonId
  label: string
}

export interface OpportunityFeedbackEntry {
  rating: OpportunityFeedbackRating
  reasons: OpportunityFeedbackReasonId[]
  otherReason?: string
  notes?: string
}

const feedbackReasonOptions: Record<
  OpportunityFeedbackRating,
  OpportunityFeedbackReasonOption[]
> = {
  strong: [
    { id: "budget_signal", label: "strong budget signal" },
    { id: "operational_pain", label: "clear operational pain" },
    { id: "good_timing", label: "good timing" },
    { id: "product_fit", label: "relevant to our product" },
  ],
  medium: [
    { id: "needs_more_evidence", label: "needs more evidence" },
    { id: "interesting_but_incomplete", label: "interesting but incomplete" },
    { id: "unclear_buying_committee", label: "buying committee unclear" },
    { id: "timing_not_confirmed", label: "timing not confirmed" },
  ],
  weak: [
    { id: "no_budget", label: "no budget" },
    { id: "weak_signal", label: "weak signal" },
    { id: "wrong_stakeholder", label: "wrong stakeholder" },
    { id: "unclear_timing", label: "unclear timing" },
  ],
}

const learningPhrases: Record<OpportunityFeedbackReasonId, string> = {
  budget_signal: "budget signals",
  operational_pain: "operational pain",
  good_timing: "timing",
  product_fit: "product fit",
  needs_more_evidence: "evidence quality",
  interesting_but_incomplete: "partial signal patterns",
  unclear_buying_committee: "stakeholder clarity",
  timing_not_confirmed: "timeline confidence",
  no_budget: "budget risk",
  weak_signal: "signal strength",
  wrong_stakeholder: "stakeholder fit",
  unclear_timing: "timing risk",
}

export function getFeedbackReasonOptions(rating: OpportunityFeedbackRating) {
  return feedbackReasonOptions[rating]
}

export function createFeedbackLearningSummary(
  rating: OpportunityFeedbackRating,
  reasons: OpportunityFeedbackReasonId[]
) {
  const focus = reasons
    .slice(0, 2)
    .map((reason) => learningPhrases[reason])
    .join(" and ")

  if (!focus) {
    if (rating === "strong") {
      return "NationGraph will lean more on the signals your team marks as strong."
    }

    if (rating === "weak") {
      return "NationGraph will down-rank signals your team considers weak."
    }

    return "NationGraph will treat similar opportunities as promising but incomplete."
  }

  if (rating === "strong") {
    return `NationGraph will weight ${focus} more heavily when surfacing similar opportunities.`
  }

  if (rating === "weak") {
    return `NationGraph will be more cautious around ${focus} in future opportunities.`
  }

  return `NationGraph will look for stronger proof around ${focus} before treating similar opportunities as high priority.`
}

export function getFeedbackRatingLabel(rating: OpportunityFeedbackRating) {
  switch (rating) {
    case "strong":
      return "Strong"
    case "medium":
      return "Medium"
    case "weak":
      return "Weak"
  }
}
