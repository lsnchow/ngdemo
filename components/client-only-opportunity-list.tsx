"use client"

import dynamic from "next/dynamic"

const OpportunityList = dynamic(
  () => import("@/components/opportunity-list").then((mod) => mod.OpportunityList),
  { ssr: false }
)

export function ClientOnlyOpportunityList() {
  return <OpportunityList />
}
