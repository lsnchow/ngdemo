import type {
  Opportunity,
  Evidence,
  Stakeholder,
  EvidenceGap,
  Task,
  CapturePlan,
  User,
  ActivityLog,
} from "./types"

export const users: User[] = [
  {
    id: "user_01",
    name: "Sarah Chen",
    email: "sarah@company.com",
    avatar: "/avatars/sarah.jpg",
    role: "Account Executive",
  },
  {
    id: "user_02",
    name: "Marcus Johnson",
    email: "marcus@company.com",
    avatar: "/avatars/marcus.jpg",
    role: "SDR",
  },
  {
    id: "user_03",
    name: "Emily Rodriguez",
    email: "emily@company.com",
    avatar: "/avatars/emily.jpg",
    role: "Sales Manager",
  },
]

export const opportunities: Opportunity[] = [
  {
    id: "opp_001",
    account_name: "North Valley School District",
    title: "Student Transportation Modernization",
    jurisdiction: "California",
    sector: "K-12",
    priority: "high",
    status: "review",
    owner_id: "user_01",
    summary:
      "District showing signs of transportation system modernization with board discussions about routing inefficiencies and driver shortages.",
    created_at: "2026-03-10T14:00:00Z",
    updated_at: "2026-03-19T10:30:00Z",
    tags: ["transportation", "modernization", "routing"],
  },
  {
    id: "opp_002",
    account_name: "City of Millbrook",
    title: "Permitting Workflow Modernization",
    jurisdiction: "Texas",
    sector: "Municipal",
    priority: "medium",
    status: "pursuing",
    owner_id: "user_01",
    summary:
      "City council discussed outdated permitting workflows and a new modernization initiative in recent meetings.",
    created_at: "2026-03-05T09:00:00Z",
    updated_at: "2026-03-18T15:45:00Z",
    tags: ["permitting", "workflow", "digital-transformation"],
  },
  {
    id: "opp_003",
    account_name: "Pine County Public Safety",
    title: "CAD System Replacement",
    jurisdiction: "Oregon",
    sector: "Public Safety",
    priority: "high",
    status: "review",
    owner_id: "user_02",
    summary:
      "Dispatch complaints recurring across meetings. Current CAD contract appears to expire in 8 months.",
    created_at: "2026-03-01T11:00:00Z",
    updated_at: "2026-03-17T09:15:00Z",
    tags: ["CAD", "dispatch", "public-safety"],
  },
  {
    id: "opp_004",
    account_name: "Westlake Community College",
    title: "Student Information System Upgrade",
    jurisdiction: "Washington",
    sector: "Higher Ed",
    priority: "medium",
    status: "new",
    owner_id: "user_03",
    summary:
      "College exploring modern SIS solutions after years on legacy platform. IT director expressed interest.",
    created_at: "2026-03-12T08:30:00Z",
    updated_at: "2026-03-19T08:30:00Z",
    tags: ["SIS", "higher-ed", "legacy-replacement"],
  },
  {
    id: "opp_005",
    account_name: "Metro Transit Authority",
    title: "Fleet Management Platform",
    jurisdiction: "Illinois",
    sector: "Transportation",
    priority: "low",
    status: "paused",
    owner_id: "user_02",
    summary:
      "Early stage exploration of fleet management solutions. Budget not yet approved.",
    created_at: "2026-02-28T16:00:00Z",
    updated_at: "2026-03-10T11:00:00Z",
    tags: ["fleet", "transit", "early-stage"],
  },
  {
    id: "opp_006",
    account_name: "Riverside Fire Department",
    title: "Emergency Response Optimization",
    jurisdiction: "Arizona",
    sector: "Public Safety",
    priority: "high",
    status: "pursuing",
    owner_id: "user_01",
    summary:
      "Department seeking to improve response times and resource allocation with modern dispatch technology.",
    created_at: "2026-03-08T13:00:00Z",
    updated_at: "2026-03-19T14:00:00Z",
    tags: ["emergency", "dispatch", "optimization"],
  },
]

export const evidence: Record<string, Evidence[]> = {
  opp_001: [
    {
      id: "ev_001",
      opportunity_id: "opp_001",
      category: "pain",
      source_type: "board_minutes",
      source_title: "Board Meeting - January 12",
      excerpt:
        "The district cited routing inefficiencies and driver shortages as primary concerns. Current routes are outdated and don't reflect demographic shifts.",
      source_url: "https://example.com/board-jan.pdf",
      confidence: 0.85,
      importance: "high",
      date_observed: "2026-01-12",
    },
    {
      id: "ev_002",
      opportunity_id: "opp_001",
      category: "timing",
      source_type: "strategic_plan",
      source_title: "2026 Strategic Plan",
      excerpt:
        "Route optimization and transportation modernization listed as Q2 priority initiative.",
      source_url: "https://example.com/strategic-plan.pdf",
      confidence: 0.78,
      importance: "high",
      date_observed: "2026-02-01",
    },
    {
      id: "ev_003",
      opportunity_id: "opp_001",
      category: "budget",
      source_type: "budget_document",
      source_title: "Proposed FY2027 Budget",
      excerpt:
        "Transportation line item shows 15% increase allocation pending board approval.",
      confidence: 0.65,
      importance: "medium",
      date_observed: "2026-03-01",
    },
    {
      id: "ev_004",
      opportunity_id: "opp_001",
      category: "vendor",
      source_type: "contract_record",
      source_title: "Current Vendor Analysis",
      excerpt:
        "Legacy provider contract expires August 2026. No renewal discussions observed.",
      confidence: 0.72,
      importance: "high",
      date_observed: "2026-02-15",
    },
  ],
  opp_002: [
    {
      id: "ev_005",
      opportunity_id: "opp_002",
      category: "pain",
      source_type: "council_minutes",
      source_title: "City Council Meeting - February 20",
      excerpt:
        "Multiple council members expressed frustration with permit processing delays averaging 45 days.",
      confidence: 0.88,
      importance: "high",
      date_observed: "2026-02-20",
    },
    {
      id: "ev_006",
      opportunity_id: "opp_002",
      category: "timing",
      source_type: "press_release",
      source_title: "Modernization Initiative Announcement",
      excerpt:
        "City announces digital transformation initiative with permitting as Phase 1 priority.",
      source_url: "https://millbrook.gov/news/digital-transform",
      confidence: 0.92,
      importance: "high",
      date_observed: "2026-03-01",
    },
  ],
  opp_003: [
    {
      id: "ev_007",
      opportunity_id: "opp_003",
      category: "pain",
      source_type: "meeting_notes",
      source_title: "Public Safety Committee - January",
      excerpt:
        "Dispatch system crashes reported 3 times in Q4. Response time data reliability questioned.",
      confidence: 0.82,
      importance: "high",
      date_observed: "2026-01-18",
    },
    {
      id: "ev_008",
      opportunity_id: "opp_003",
      category: "vendor",
      source_type: "contract_record",
      source_title: "CAD Contract Review",
      excerpt:
        "Current CAD contract with LegacyDispatch Inc. expires November 2026. 5-year term ending.",
      confidence: 0.95,
      importance: "high",
      date_observed: "2026-02-10",
    },
  ],
}

export const stakeholders: Record<string, Stakeholder[]> = {
  opp_001: [
    {
      id: "stk_001",
      opportunity_id: "opp_001",
      name: "Dr. Maria Santos",
      title: "Director of Transportation",
      organization: "North Valley School District",
      role: "champion",
      confidence: 0.85,
      engagement_status: "engaged",
      notes:
        "Strong advocate for modernization. Has been vocal about current system limitations.",
    },
    {
      id: "stk_002",
      opportunity_id: "opp_001",
      name: "Robert Chen",
      title: "Chief Financial Officer",
      organization: "North Valley School District",
      role: "economic_buyer",
      confidence: 0.72,
      engagement_status: "contacted",
      notes: "Controls budget approval. Concerned about implementation costs.",
    },
    {
      id: "stk_003",
      opportunity_id: "opp_001",
      name: "Jennifer Wu",
      title: "IT Director",
      organization: "North Valley School District",
      role: "evaluator",
      confidence: 0.68,
      engagement_status: "not_contacted",
      notes: "Will likely lead technical evaluation. Integration concerns expected.",
    },
  ],
  opp_002: [
    {
      id: "stk_004",
      opportunity_id: "opp_002",
      name: "James Mitchell",
      title: "City Manager",
      organization: "City of Millbrook",
      role: "economic_buyer",
      confidence: 0.78,
      engagement_status: "contacted",
      notes: "Driving modernization initiative from top.",
    },
    {
      id: "stk_005",
      opportunity_id: "opp_002",
      name: "Angela Torres",
      title: "Director of Development Services",
      organization: "City of Millbrook",
      role: "champion",
      confidence: 0.82,
      engagement_status: "engaged",
      notes: "Daily user of permitting system. Highly motivated for change.",
    },
  ],
  opp_003: [
    {
      id: "stk_006",
      opportunity_id: "opp_003",
      name: "Chief David Park",
      title: "Fire Chief",
      organization: "Pine County Public Safety",
      role: "champion",
      confidence: 0.75,
      engagement_status: "not_contacted",
    },
  ],
}

export const evidenceGaps: Record<string, EvidenceGap[]> = {
  opp_001: [
    {
      id: "gap_001",
      opportunity_id: "opp_001",
      title: "Budget approval not confirmed",
      severity: "high",
      owner_id: "user_01",
      status: "open",
      due_date: "2026-03-25",
      suggested_action: "Confirm budget status with CFO in next meeting",
    },
    {
      id: "gap_002",
      opportunity_id: "opp_001",
      title: "Technical requirements unclear",
      severity: "medium",
      owner_id: "user_01",
      status: "open",
      due_date: "2026-03-28",
      suggested_action: "Schedule discovery call with IT Director",
    },
    {
      id: "gap_003",
      opportunity_id: "opp_001",
      title: "Decision timeline unknown",
      severity: "medium",
      status: "open",
      suggested_action: "Ask champion about expected decision timeframe",
    },
  ],
  opp_002: [
    {
      id: "gap_004",
      opportunity_id: "opp_002",
      title: "Procurement path not confirmed",
      severity: "high",
      owner_id: "user_01",
      status: "open",
      due_date: "2026-03-22",
    },
    {
      id: "gap_005",
      opportunity_id: "opp_002",
      title: "Incumbent vendor unknown",
      severity: "low",
      status: "open",
    },
  ],
  opp_003: [
    {
      id: "gap_006",
      opportunity_id: "opp_003",
      title: "Budget allocation unclear",
      severity: "high",
      owner_id: "user_02",
      status: "open",
    },
    {
      id: "gap_007",
      opportunity_id: "opp_003",
      title: "Decision-maker not identified",
      severity: "high",
      status: "open",
    },
  ],
}

export const tasks: Record<string, Task[]> = {
  opp_001: [
    {
      id: "task_001",
      opportunity_id: "opp_001",
      title: "Schedule intro call with Transportation Director",
      owner_id: "user_01",
      status: "done",
      priority: "high",
      due_date: "2026-03-15",
    },
    {
      id: "task_002",
      opportunity_id: "opp_001",
      title: "Confirm budget allocation with CFO",
      owner_id: "user_01",
      status: "in_progress",
      priority: "high",
      due_date: "2026-03-25",
      linked_entity_type: "evidence_gap",
      linked_entity_id: "gap_001",
    },
    {
      id: "task_003",
      opportunity_id: "opp_001",
      title: "Prepare technical discovery questions",
      owner_id: "user_02",
      status: "todo",
      priority: "medium",
      due_date: "2026-03-22",
    },
    {
      id: "task_004",
      opportunity_id: "opp_001",
      title: "Research competitor implementations in K-12",
      owner_id: "user_02",
      status: "todo",
      priority: "low",
      due_date: "2026-03-28",
    },
  ],
  opp_002: [
    {
      id: "task_005",
      opportunity_id: "opp_002",
      title: "Draft proposal outline",
      owner_id: "user_01",
      status: "in_progress",
      priority: "high",
      due_date: "2026-03-20",
    },
    {
      id: "task_006",
      opportunity_id: "opp_002",
      title: "Identify procurement contact",
      owner_id: "user_01",
      status: "todo",
      priority: "medium",
      due_date: "2026-03-22",
    },
  ],
  opp_003: [
    {
      id: "task_007",
      opportunity_id: "opp_003",
      title: "Request intro from mutual contact",
      owner_id: "user_02",
      status: "todo",
      priority: "high",
      due_date: "2026-03-21",
    },
  ],
}

export const capturePlans: Record<string, CapturePlan> = {
  opp_001: {
    id: "plan_001",
    opportunity_id: "opp_001",
    deal_thesis:
      "North Valley School District is experiencing significant operational pain in transportation management, with documented inefficiencies in routing and ongoing driver shortages. Their strategic plan prioritizes modernization in Q2, creating a strong timing alignment with our solution.",
    why_now:
      "Contract with legacy provider expires August 2026. Strategic plan identifies Q2 as priority window. Board has actively discussed pain points in recent meetings.",
    our_angle:
      "Our route optimization platform directly addresses their core pain points: routing inefficiency and resource allocation. Strong K-12 references in California strengthen our position.",
    procurement_path: "net_new_buy",
    pursue_recommendation: "pursue",
    confidence: 0.76,
    last_generated_at: "2026-03-19T10:00:00Z",
  },
  opp_002: {
    id: "plan_002",
    opportunity_id: "opp_002",
    deal_thesis:
      "City of Millbrook has publicly committed to digital transformation with permitting as Phase 1. Council frustration with 45-day processing delays creates urgency.",
    why_now:
      "Official modernization initiative announced. Phase 1 prioritizes permitting. Political pressure from council visible in public meetings.",
    our_angle:
      "Our workflow platform has proven municipal implementations. Time-to-value messaging aligns with their urgency.",
    procurement_path: "formal_rfp_likely",
    pursue_recommendation: "pursue",
    confidence: 0.72,
    last_generated_at: "2026-03-18T15:00:00Z",
  },
  opp_003: {
    id: "plan_003",
    opportunity_id: "opp_003",
    deal_thesis:
      "Pine County Public Safety faces reliability issues with current CAD system. Contract expiration in November 2026 creates natural evaluation window.",
    why_now:
      "Current contract expires November 2026. System reliability issues documented. Public safety committee has escalated concerns.",
    our_angle:
      "Our CAD solution addresses reliability concerns with proven uptime. Modern architecture reduces integration complexity.",
    procurement_path: "renewal",
    pursue_recommendation: "needs_research",
    confidence: 0.58,
    last_generated_at: "2026-03-17T09:00:00Z",
  },
}

export const activityLogs: Record<string, ActivityLog[]> = {
  opp_001: [
    {
      id: "log_001",
      opportunity_id: "opp_001",
      type: "note",
      content: "Initial call with Dr. Santos went well. She's enthusiastic about modernization.",
      user_id: "user_01",
      created_at: "2026-03-15T14:30:00Z",
    },
    {
      id: "log_002",
      opportunity_id: "opp_001",
      type: "ai_generated",
      content: "Capture plan generated with 76% confidence.",
      created_at: "2026-03-19T10:00:00Z",
    },
    {
      id: "log_003",
      opportunity_id: "opp_001",
      type: "status_change",
      content: "Status changed from 'new' to 'review'",
      user_id: "user_01",
      created_at: "2026-03-12T09:00:00Z",
    },
  ],
  opp_002: [
    {
      id: "log_004",
      opportunity_id: "opp_002",
      type: "status_change",
      content: "Status changed from 'review' to 'pursuing'",
      user_id: "user_01",
      created_at: "2026-03-16T11:00:00Z",
    },
  ],
}
