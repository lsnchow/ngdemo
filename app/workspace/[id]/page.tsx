import { notFound } from "next/navigation"
import { TopHeader } from "@/components/top-header"
import { WorkspaceContent } from "@/components/workspace/workspace-content"
import { findOpportunityWorkspaceData } from "@/lib/workspace/workspace-context"

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workspace = findOpportunityWorkspaceData(id)

  if (!workspace) {
    notFound()
  }

  return (
    <>
      <TopHeader
        breadcrumbs={[
          { label: "Opportunities", href: "/" },
          { label: workspace.opportunity.account_name },
        ]}
      />
      <main className="flex-1 overflow-auto bg-muted/30">
        <WorkspaceContent workspace={workspace} />
      </main>
    </>
  )
}
