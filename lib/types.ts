// Core data types for Capture Workspace

export type Priority = "high" | "medium" | "low"
export type Status = "new" | "review" | "pursuing" | "won" | "lost" | "paused"
export type EvidenceCategory = "pain" | "timing" | "budget" | "vendor" | "procurement"
export type StakeholderRole = "champion" | "economic_buyer" | "evaluator" | "gatekeeper" | "procurement" | "unknown"
export type ProcurementPath = "renewal" | "net_new_buy" | "pilot" | "cooperative_contract" | "formal_rfp_likely" | "unknown"
export type TaskStatus = "todo" | "in_progress" | "done"
export type EngagementStatus = "not_contacted" | "contacted" | "engaged" | "champion"
export type GapSeverity = "high" | "medium" | "low"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface Opportunity {
  id: string
  account_name: string
  title: string
  jurisdiction: string
  sector: string
  priority: Priority
  status: Status
  owner_id: string
  summary: string
  created_at: string
  updated_at: string
  tags?: string[]
}

export interface Evidence {
  id: string
  opportunity_id: string
  category: EvidenceCategory
  source_type: string
  source_title: string
  excerpt: string
  source_url?: string
  confidence: number
  importance: Priority
  date_observed: string
}

export interface Stakeholder {
  id: string
  opportunity_id: string
  name: string
  title: string
  organization?: string
  role: StakeholderRole
  confidence: number
  engagement_status: EngagementStatus
  notes?: string
}

export interface EvidenceGap {
  id: string
  opportunity_id: string
  title: string
  severity: GapSeverity
  owner_id?: string
  status: "open" | "resolved"
  due_date?: string
  suggested_action?: string
}

export interface Task {
  id: string
  opportunity_id: string
  title: string
  owner_id?: string
  status: TaskStatus
  priority: Priority
  due_date?: string
  linked_entity_type?: "evidence" | "stakeholder" | "evidence_gap"
  linked_entity_id?: string
}

export interface CapturePlan {
  id: string
  opportunity_id: string
  deal_thesis: string
  why_now: string
  our_angle: string
  procurement_path: ProcurementPath
  pursue_recommendation: "pursue" | "no_pursue" | "needs_research"
  confidence: number
  last_generated_at: string
}

export interface Brief {
  id: string
  opportunity_id: string
  type: "exec" | "manager" | "battlecard" | "meeting_prep" | "slack" | "crm"
  content: string
  created_at: string
}

export interface ActivityLog {
  id: string
  opportunity_id: string
  type: "note" | "status_change" | "ai_generated" | "export" | "update"
  content: string
  user_id?: string
  created_at: string
}
