import { NextResponse } from "next/server"

import { sendOpportunityCopilotMessage } from "@/lib/backboard/client"
import { findOpportunityWorkspaceData } from "@/lib/workspace/workspace-context"

export const runtime = "nodejs"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const workspace = findOpportunityWorkspaceData(id)

  if (!workspace) {
    return NextResponse.json(
      { error: "Opportunity not found." },
      { status: 404 }
    )
  }

  const body = (await request.json()) as { message?: string }
  const message = body.message?.trim()

  if (!message) {
    return NextResponse.json(
      { error: "A message is required." },
      { status: 400 }
    )
  }

  try {
    const response = await sendOpportunityCopilotMessage(id, message)

    return NextResponse.json({
      content: response.content,
      threadId: response.threadId,
      model: response.model,
      opportunityName: workspace.opportunity.account_name,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach the copilot right now."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
