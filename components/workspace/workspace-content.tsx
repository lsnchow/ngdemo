"use client"

import { useState } from "react"
import { OpportunityHeader } from "./opportunity-header"
import { DealThesisCard } from "./deal-thesis-card"
import { ProcurementPathCard } from "./procurement-path-card"
import { EvidenceBoardCard } from "./evidence-board-card"
import { GapChecklistCard } from "./gap-checklist-card"
import { ActionBoardCard } from "./action-board-card"
import { TimelineCard } from "./timeline-card"
import { CoordinationPanel } from "./coordination-panel"
import { OpportunityCopilot } from "./opportunity-copilot"
import { StakeholderGraphCard } from "./stakeholder-graph-card"
import { EmailComposerSheet } from "./email-composer-sheet"
import { OpportunityFeedbackCard } from "./opportunity-feedback-card"
import { users } from "@/lib/mock-data"
import type { EmailDraft } from "@/lib/workspace/email-drafts"
import { createStakeholderEmailDraft } from "@/lib/workspace/email-drafts"
import type { OpportunityWorkspaceData } from "@/lib/workspace/workspace-context"

interface WorkspaceContentProps {
  workspace: OpportunityWorkspaceData
}

export function WorkspaceContent({ workspace }: WorkspaceContentProps) {
  const [draft, setDraft] = useState<EmailDraft | null>(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const champion = workspace.stakeholders.find((stakeholder) => stakeholder.role === "champion")

  const openDraft = (nextDraft: EmailDraft) => {
    setDraft(nextDraft)
    setIsComposerOpen(true)
  }

  return (
    <div className="p-6">
      <OpportunityHeader
        opportunity={workspace.opportunity}
        hasChampion={Boolean(champion)}
        onDraftChampionEmail={() => {
          if (!champion) {
            return
          }

          openDraft(
            createStakeholderEmailDraft({
              opportunity: workspace.opportunity,
              stakeholder: champion,
              intent: "follow_up",
            })
          )
        }}
      />

      <div className="mt-6 space-y-6">
        <OpportunityFeedbackCard
          key={workspace.opportunity.id}
          opportunityId={workspace.opportunity.id}
        />
        <DealThesisCard capturePlan={workspace.capturePlan} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StakeholderGraphCard workspace={workspace} onDraftEmail={openDraft} />
          <OpportunityCopilot
            key={workspace.opportunity.id}
            workspace={workspace}
            onDraftEmail={openDraft}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EvidenceBoardCard evidence={workspace.evidence} />
          <ProcurementPathCard capturePlan={workspace.capturePlan} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GapChecklistCard gaps={workspace.gaps} users={users} />
          <ActionBoardCard tasks={workspace.tasks} users={users} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TimelineCard logs={workspace.logs} users={users} />
          <CoordinationPanel
            opportunity={workspace.opportunity}
            stakeholders={workspace.stakeholders}
            gaps={workspace.gaps}
            tasks={workspace.tasks}
          />
        </div>
      </div>

      <EmailComposerSheet
        draft={draft}
        open={isComposerOpen}
        onOpenChange={setIsComposerOpen}
      />
    </div>
  )
}
