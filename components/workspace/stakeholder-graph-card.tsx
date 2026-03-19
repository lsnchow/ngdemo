"use client"

import "@xyflow/react/dist/style.css"

import { useMemo } from "react"
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Node,
  type NodeProps,
  useEdgesState,
  useNodesState,
} from "@xyflow/react"

import { Mail, Network, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StakeholderRole } from "@/lib/types"
import type { EmailDraft, EmailDraftIntent } from "@/lib/workspace/email-drafts"
import { createStakeholderEmailDraft } from "@/lib/workspace/email-drafts"
import { buildStakeholderGraph } from "@/lib/workspace/stakeholder-graph"
import type { OpportunityWorkspaceData } from "@/lib/workspace/workspace-context"
import { cn } from "@/lib/utils"

type GraphNodeData = {
  label: string
  title: string
  role: StakeholderRole | "opportunity"
  description: string
  email?: string
  onDraftEmail?: () => void
}

const roleBadgeStyles: Record<StakeholderRole | "opportunity", string> = {
  opportunity: "bg-primary/10 text-primary",
  champion: "bg-primary/10 text-primary",
  economic_buyer: "bg-secondary text-secondary-foreground",
  evaluator: "bg-primary/10 text-primary",
  gatekeeper: "bg-secondary text-secondary-foreground",
  procurement: "bg-secondary text-secondary-foreground",
  unknown: "bg-muted text-muted-foreground",
}

const roleLabels: Record<StakeholderRole | "opportunity", string> = {
  opportunity: "Opportunity",
  champion: "Champion",
  economic_buyer: "Economic Buyer",
  evaluator: "Evaluator",
  gatekeeper: "Gatekeeper",
  procurement: "Procurement",
  unknown: "Unknown",
}

function getDefaultIntent(role: StakeholderRole): EmailDraftIntent {
  switch (role) {
    case "economic_buyer":
      return "budget_alignment"
    case "evaluator":
      return "technical_validation"
    case "champion":
      return "follow_up"
    default:
      return "intro"
  }
}

function StakeholderNode({ data }: NodeProps<Node<GraphNodeData>>) {
  const isOpportunity = data.role === "opportunity"

  return (
    <div className="min-w-64 rounded-xl border bg-card p-4 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border-0 !bg-border"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-balance">{data.label}</p>
          <p className="mt-1 text-xs text-muted-foreground text-pretty">
            {data.title}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn("shrink-0 text-xs", roleBadgeStyles[data.role])}
        >
          {roleLabels[data.role]}
        </Badge>
      </div>
      <p className="mt-3 line-clamp-4 text-xs text-muted-foreground text-pretty">
        {data.description}
      </p>
      {!isOpportunity ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="nodrag mt-4 w-full gap-2"
          onClick={data.onDraftEmail}
        >
          <Mail className="size-4" />
          Draft Email
        </Button>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border-0 !bg-border"
      />
    </div>
  )
}

const nodeTypes = {
  stakeholder: StakeholderNode,
}

function StakeholderGraphCanvas({
  workspace,
  onDraftEmail,
}: {
  workspace: OpportunityWorkspaceData
  onDraftEmail: (draft: EmailDraft) => void
}) {
  const baseGraph = useMemo(
    () => buildStakeholderGraph(workspace.opportunity.id),
    [workspace.opportunity.id]
  )

  const initialNodes = useMemo(
    () =>
      baseGraph.nodes.map((node) => {
        const stakeholder = workspace.stakeholders.find((item) => item.id === node.id)

        return {
          ...node,
          type: "stakeholder",
          data: {
            ...node.data,
            onDraftEmail: stakeholder
              ? () =>
                  onDraftEmail(
                    createStakeholderEmailDraft({
                      opportunity: workspace.opportunity,
                      stakeholder,
                      intent: getDefaultIntent(stakeholder.role),
                    })
                  )
              : undefined,
          },
        }
      }),
    [baseGraph.nodes, onDraftEmail, workspace.opportunity, workspace.stakeholders]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(baseGraph.edges)

  return (
    <div className="h-[640px] rounded-xl border bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.18, minZoom: 0.85 }}
        minZoom={0.7}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export function StakeholderGraphCard({
  workspace,
  onDraftEmail,
}: {
  workspace: OpportunityWorkspaceData
  onDraftEmail: (draft: EmailDraft) => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base text-balance">
          <Network className="size-4 text-muted-foreground" />
          Stakeholder Graph
        </CardTitle>
        <CardDescription className="text-pretty">
          Drag nodes around to explore who is advocating, evaluating, or holding
          the budget for this opportunity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {workspace.stakeholders.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {workspace.stakeholders.map((stakeholder) => (
                <Badge
                  key={stakeholder.id}
                  variant="outline"
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="size-3 text-muted-foreground" />
                  {stakeholder.name} · {roleLabels[stakeholder.role]}
                </Badge>
              ))}
            </div>
            <ReactFlowProvider>
              <StakeholderGraphCanvas
                key={workspace.opportunity.id}
                workspace={workspace}
                onDraftEmail={onDraftEmail}
              />
            </ReactFlowProvider>
          </>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
            <p className="text-sm font-medium text-balance">
              No stakeholders mapped yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Add at least one champion or evaluator to start building the buying
              committee view.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
