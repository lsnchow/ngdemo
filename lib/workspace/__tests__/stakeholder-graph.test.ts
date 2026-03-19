import { describe, expect, it } from "vitest"

import { buildStakeholderGraph } from "@/lib/workspace/stakeholder-graph"

describe("stakeholder graph", () => {
  it("creates an opportunity anchor node and stakeholder nodes", () => {
    const graph = buildStakeholderGraph("opp_001")

    expect(graph.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining(["opp_001", "stk_001", "stk_002", "stk_003"])
    )
  })

  it("creates logical relationship edges for visible stakeholder roles", () => {
    const graph = buildStakeholderGraph("opp_001")

    expect(graph.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "stk_001",
          target: "opp_001",
          label: "Champions change",
        }),
        expect.objectContaining({
          source: "stk_002",
          target: "opp_001",
          label: "Approves budget",
        }),
      ])
    )
  })

  it("spaces nodes into distinct lanes so cards do not collide on load", () => {
    const graph = buildStakeholderGraph("opp_001")
    const positions = Object.fromEntries(
      graph.nodes.map((node) => [node.id, node.position])
    )

    expect(positions.opp_001.x).toBeGreaterThan(positions.stk_001.x)
    expect(positions.opp_001.x).toBeLessThan(positions.stk_003.x)
    expect(Math.abs(positions.opp_001.y - positions.stk_002.y)).toBeGreaterThanOrEqual(
      220
    )
  })
})
