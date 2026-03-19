import {
  activityLogs,
  capturePlans,
  evidence,
  evidenceGaps,
  opportunities,
  stakeholders,
  tasks,
  users,
} from "@/lib/mock-data"

const stakeholderRoleDescriptions = {
  champion: "internal advocate who pushes the deal forward",
  economic_buyer: "controls budget or financial approval",
  evaluator: "technical or operational reviewer",
  gatekeeper: "controls process access or introductions",
  procurement: "owns formal purchasing steps",
  unknown: "role has not been confirmed yet",
} as const

export interface OpportunityWorkspaceData {
  opportunity: (typeof opportunities)[number]
  owner: (typeof users)[number] | undefined
  stakeholders: typeof stakeholders[string]
  evidence: typeof evidence[string]
  gaps: typeof evidenceGaps[string]
  tasks: typeof tasks[string]
  capturePlan: (typeof capturePlans)[string] | undefined
  logs: typeof activityLogs[string]
}

export function findOpportunityWorkspaceData(
  opportunityId: string
): OpportunityWorkspaceData | null {
  const opportunity = opportunities.find((item) => item.id === opportunityId)

  if (!opportunity) {
    return null
  }

  return {
    opportunity,
    owner: users.find((item) => item.id === opportunity.owner_id),
    stakeholders: stakeholders[opportunityId] ?? [],
    evidence: evidence[opportunityId] ?? [],
    gaps: evidenceGaps[opportunityId] ?? [],
    tasks: tasks[opportunityId] ?? [],
    capturePlan: capturePlans[opportunityId],
    logs: activityLogs[opportunityId] ?? [],
  }
}

export function getOpportunityWorkspaceData(
  opportunityId: string
): OpportunityWorkspaceData {
  const workspace = findOpportunityWorkspaceData(opportunityId)

  if (!workspace) {
    throw new Error(`Unknown opportunity: ${opportunityId}`)
  }

  return workspace
}

export function buildOpportunityWorkspaceContext(opportunityId: string): string {
  const workspace = getOpportunityWorkspaceData(opportunityId)

  const stakeholderLines =
    workspace.stakeholders.length > 0
      ? workspace.stakeholders
          .map(
            (stakeholder) =>
              `- ${stakeholder.name}, ${stakeholder.title}, ${stakeholder.role}: ${
                stakeholder.notes ?? "No notes yet."
              }`
          )
          .join("\n")
      : "- No stakeholders have been mapped yet."

  const evidenceLines =
    workspace.evidence.length > 0
      ? workspace.evidence
          .map(
            (item) =>
              `- ${item.source_title}: ${item.excerpt} (confidence ${Math.round(
                item.confidence * 100
              )}%)`
          )
          .join("\n")
      : "- No evidence has been captured yet."

  const gapLines =
    workspace.gaps.length > 0
      ? workspace.gaps
          .map(
            (gap) =>
              `- ${gap.title} [${gap.severity}]${gap.suggested_action ? `: ${gap.suggested_action}` : ""}`
          )
          .join("\n")
      : "- No open gaps."

  const taskLines =
    workspace.tasks.length > 0
      ? workspace.tasks
          .map(
            (task) =>
              `- ${task.title} (${task.status}, ${task.priority} priority${
                task.due_date ? `, due ${task.due_date}` : ""
              })`
          )
          .join("\n")
      : "- No tasks."

  return [
    `Opportunity: ${workspace.opportunity.account_name}`,
    `Title: ${workspace.opportunity.title}`,
    `Jurisdiction: ${workspace.opportunity.jurisdiction}`,
    `Sector: ${workspace.opportunity.sector}`,
    `Summary: ${workspace.opportunity.summary}`,
    `Owner: ${workspace.owner?.name ?? "Unassigned"}`,
    "",
    "Role meanings:",
    `- Champion: ${stakeholderRoleDescriptions.champion}`,
    `- Economic Buyer: ${stakeholderRoleDescriptions.economic_buyer}`,
    `- Evaluator: ${stakeholderRoleDescriptions.evaluator}`,
    `- Gatekeeper: ${stakeholderRoleDescriptions.gatekeeper}`,
    `- Procurement: ${stakeholderRoleDescriptions.procurement}`,
    "",
    "Stakeholders:",
    stakeholderLines,
    "",
    "Evidence:",
    evidenceLines,
    "",
    "Open gaps:",
    gapLines,
    "",
    "Tasks:",
    taskLines,
    workspace.capturePlan
      ? `\nCapture plan:\n- Deal thesis: ${workspace.capturePlan.deal_thesis}\n- Why now: ${workspace.capturePlan.why_now}\n- Our angle: ${workspace.capturePlan.our_angle}`
      : "",
  ]
    .filter(Boolean)
    .join("\n")
}

export function getStakeholderRoleDescription(role: keyof typeof stakeholderRoleDescriptions) {
  return stakeholderRoleDescriptions[role]
}
