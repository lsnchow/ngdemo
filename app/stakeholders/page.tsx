import { TopHeader } from "@/components/top-header"
import { ClientOnlyStakeholderWorkspace } from "@/components/client-only-stakeholder-workspace"

export default function StakeholdersPage() {
  return (
    <>
      <TopHeader
        breadcrumbs={[{ label: "Stakeholders" }]}
        showActions={false}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <ClientOnlyStakeholderWorkspace />
        </div>
      </main>
    </>
  )
}
