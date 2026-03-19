import { describe, expect, it } from "vitest"

import { opportunities, stakeholders } from "@/lib/mock-data"
import { createStakeholderEmailDraft } from "@/lib/workspace/email-drafts"

describe("email draft helper", () => {
  it("builds a budget-oriented note for the economic buyer", () => {
    const opportunity = opportunities.find((item) => item.id === "opp_001")
    const stakeholder = stakeholders.opp_001.find(
      (item) => item.role === "economic_buyer"
    )

    if (!opportunity || !stakeholder) {
      throw new Error("Expected mock data for opp_001")
    }

    const draft = createStakeholderEmailDraft({
      opportunity,
      stakeholder,
      intent: "budget_alignment",
    })

    expect(draft.subject).toContain("North Valley School District")
    expect(draft.body).toContain("implementation costs")
    expect(draft.body).toContain("Student Transportation Modernization")
  })
})
