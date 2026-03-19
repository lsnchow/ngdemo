import { TopHeader } from "@/components/top-header"
import { ActionsWorkspace } from "@/components/actions-workspace"

export default function ActionsPage() {
  return (
    <>
      <TopHeader
        breadcrumbs={[{ label: "Actions" }]}
        showActions={false}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <ActionsWorkspace />
        </div>
      </main>
    </>
  )
}
