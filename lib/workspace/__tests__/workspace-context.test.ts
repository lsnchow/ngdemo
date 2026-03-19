import { describe, expect, it } from "vitest"

import {
  buildOpportunityWorkspaceContext,
  getOpportunityWorkspaceData,
} from "@/lib/workspace/workspace-context"

describe("workspace context helpers", () => {
  it("returns the selected opportunity with related workspace data", () => {
    const workspace = getOpportunityWorkspaceData("opp_001")

    expect(workspace.opportunity.account_name).toBe("North Valley School District")
    expect(workspace.owner?.name).toBe("Sarah Chen")
    expect(workspace.stakeholders).toHaveLength(3)
    expect(workspace.evidence).toHaveLength(4)
    expect(workspace.gaps).toHaveLength(3)
  })

  it("builds a copilot context string with role explanations", () => {
    const context = buildOpportunityWorkspaceContext("opp_001")

    expect(context).toContain("North Valley School District")
    expect(context).toContain("Champion: internal advocate")
    expect(context).toContain("Economic Buyer: controls budget")
    expect(context).toContain("Evaluator: technical or operational reviewer")
    expect(context).toContain("Budget approval not confirmed")
  })
})
