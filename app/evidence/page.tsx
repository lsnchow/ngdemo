import { TopHeader } from "@/components/top-header"
import { EvidenceLocker } from "@/components/evidence-locker"

export default function EvidencePage() {
  return (
    <>
      <TopHeader
        breadcrumbs={[{ label: "Evidence" }]}
        showActions={false}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <EvidenceLocker />
        </div>
      </main>
    </>
  )
}
