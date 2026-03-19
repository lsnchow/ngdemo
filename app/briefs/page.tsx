import { TopHeader } from "@/components/top-header"
import { BriefGenerator } from "@/components/brief-generator"

export default function BriefsPage() {
  return (
    <>
      <TopHeader
        breadcrumbs={[{ label: "Briefs" }]}
        showActions={false}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <BriefGenerator />
        </div>
      </main>
    </>
  )
}
