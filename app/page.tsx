import { TopHeader } from "@/components/top-header"
import { ClientOnlyOpportunityList } from "@/components/client-only-opportunity-list"

export default function OpportunitiesPage() {
  return (
    <>
      <TopHeader
        breadcrumbs={[{ label: "Opportunities" }]}
        showActions={false}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <ClientOnlyOpportunityList />
        </div>
      </main>
    </>
  )
}
