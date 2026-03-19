import type { Edge, Node } from "@xyflow/react"

import { opportunities, stakeholders } from "@/lib/mock-data"
import type { StakeholderRole } from "@/lib/types"
import { getStakeholderRoleDescription } from "@/lib/workspace/workspace-context"

export interface StakeholderGraphNodeData {
  label: string
  title: string
  role: StakeholderRole | "opportunity"
  description: string
  email?: string
}

export interface StakeholderGraphResult {
  nodes: Node<StakeholderGraphNodeData>[]
  edges: Edge[]
}

const roleXPosition: Record<StakeholderRole, number> = {
  champion: 120,
  economic_buyer: 120,
  evaluator: 920,
  gatekeeper: 920,
  procurement: 520,
  unknown: 920,
}

const roleYBase: Record<StakeholderRole, number> = {
  champion: 40,
  economic_buyer: 540,
  evaluator: 40,
  gatekeeper: 540,
  procurement: 760,
  unknown: 860,
}

const roleStackOffset = 190

const roleEdgeLabel: Record<StakeholderRole, string> = {
  champion: "Champions change",
  economic_buyer: "Approves budget",
  evaluator: "Validates fit",
  gatekeeper: "Controls access",
  procurement: "Runs purchasing",
  unknown: "Relationship pending",
}

function getStakeholderEmail(name: string, organization?: string) {
  const localPart = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")
  const domainBase = (organization ?? "example")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")

  return `${localPart}@${domainBase || "example"}.com`
}

export function buildStakeholderGraph(
  opportunityId: string
): StakeholderGraphResult {
  const opportunity = opportunities.find((item) => item.id === opportunityId)
  const opportunityStakeholders = stakeholders[opportunityId] ?? []

  if (!opportunity) {
    return { nodes: [], edges: [] }
  }

  const opportunityNode: Node<StakeholderGraphNodeData> = {
    id: opportunity.id,
    type: "default",
    position: { x: 520, y: 280 },
    draggable: false,
    data: {
      label: opportunity.account_name,
      title: opportunity.title,
      role: "opportunity",
      description: opportunity.summary,
    },
  }

  const roleCounts = new Map<StakeholderRole, number>()

  const stakeholderNodes: Node<StakeholderGraphNodeData>[] =
    opportunityStakeholders.map((stakeholder) => {
      const roleIndex = roleCounts.get(stakeholder.role) ?? 0
      roleCounts.set(stakeholder.role, roleIndex + 1)

      return {
      id: stakeholder.id,
      type: "default",
      position: {
        x: roleXPosition[stakeholder.role],
        y: roleYBase[stakeholder.role] + roleIndex * roleStackOffset,
      },
      data: {
        label: stakeholder.name,
        title: stakeholder.title,
        role: stakeholder.role,
        description: stakeholder.notes ?? getStakeholderRoleDescription(stakeholder.role),
        email: getStakeholderEmail(stakeholder.name, stakeholder.organization),
      },
    }
    })

  const edges: Edge[] = opportunityStakeholders.map((stakeholder) => ({
    id: `${stakeholder.id}-${opportunity.id}`,
    source: stakeholder.id,
    target: opportunity.id,
    label: roleEdgeLabel[stakeholder.role],
    animated: false,
  }))

  return {
    nodes: [opportunityNode, ...stakeholderNodes],
    edges,
  }
}
