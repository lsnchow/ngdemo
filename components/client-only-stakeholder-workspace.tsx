"use client"

import dynamic from "next/dynamic"

const StakeholderWorkspace = dynamic(
  () =>
    import("@/components/stakeholder-workspace").then(
      (mod) => mod.StakeholderWorkspace
    ),
  { ssr: false }
)

export function ClientOnlyStakeholderWorkspace() {
  return <StakeholderWorkspace />
}
