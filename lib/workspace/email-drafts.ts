import type { Opportunity, Stakeholder } from "@/lib/types"

export type EmailDraftIntent =
  | "intro"
  | "follow_up"
  | "technical_validation"
  | "budget_alignment"

export interface EmailDraft {
  to: string
  subject: string
  body: string
}

function getStakeholderEmail(stakeholder: Stakeholder) {
  const localPart = stakeholder.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
  const domainBase = (stakeholder.organization ?? "example")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")

  return `${localPart}@${domainBase || "example"}.com`
}

function getIntentCopy(intent: EmailDraftIntent, stakeholder: Stakeholder) {
  switch (intent) {
    case "budget_alignment":
      return {
        subjectLead: "Budget alignment for",
        opener: `I wanted to share a concise follow-up on ${stakeholder.organization ?? "your team"}'s priorities and implementation costs.`,
        ask: "If helpful, I can send a short cost and rollout outline before the next decision checkpoint.",
      }
    case "technical_validation":
      return {
        subjectLead: "Technical follow-up for",
        opener:
          "I wanted to follow up with a practical view of integrations, rollout risk, and the evaluation path.",
        ask: "Happy to tailor a technical walkthrough around your current systems and constraints.",
      }
    case "follow_up":
      return {
        subjectLead: "Following up on",
        opener:
          "I wanted to keep momentum going and summarize the main reason this opportunity looks timely.",
        ask: "If useful, I can draft a short next-step agenda for the team.",
      }
    case "intro":
    default:
      return {
        subjectLead: "Quick intro on",
        opener:
          "I wanted to introduce myself and share a quick perspective on the opportunity in front of your team.",
        ask: "If it makes sense, I would love to coordinate a short conversation around goals, timing, and evaluation criteria.",
      }
  }
}

export function createStakeholderEmailDraft({
  opportunity,
  stakeholder,
  intent,
  guidance,
}: {
  opportunity: Opportunity
  stakeholder: Stakeholder
  intent: EmailDraftIntent
  guidance?: string
}): EmailDraft {
  const copy = getIntentCopy(intent, stakeholder)

  return {
    to: getStakeholderEmail(stakeholder),
    subject: `${copy.subjectLead} ${opportunity.account_name}`,
    body: [
      `Hi ${stakeholder.name.split(" ")[0]},`,
      "",
      copy.opener,
      "",
      `Given your role as ${stakeholder.title}, I thought it would be helpful to connect this to ${opportunity.title}.`,
      stakeholder.notes ? `You seem especially focused on: ${stakeholder.notes}` : "",
      guidance ?? copy.ask,
      "",
      "Best,",
      "Sarah",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}
