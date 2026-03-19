import { describe, expect, it } from "vitest"

import {
  createFeedbackLearningSummary,
  getFeedbackReasonOptions,
} from "@/lib/workspace/opportunity-feedback"

describe("opportunity feedback helpers", () => {
  it("returns positive reasons for strong opportunities", () => {
    const options = getFeedbackReasonOptions("strong")

    expect(options.map((option) => option.id)).toEqual([
      "budget_signal",
      "operational_pain",
      "good_timing",
      "product_fit",
    ])
  })

  it("returns cautionary reasons for weak opportunities", () => {
    const options = getFeedbackReasonOptions("weak")

    expect(options.map((option) => option.id)).toEqual([
      "no_budget",
      "weak_signal",
      "wrong_stakeholder",
      "unclear_timing",
    ])
  })

  it("builds a short learning summary from selected reasons", () => {
    const summary = createFeedbackLearningSummary("strong", [
      "budget_signal",
      "good_timing",
    ])

    expect(summary).toContain("budget")
    expect(summary).toContain("timing")
  })
})
