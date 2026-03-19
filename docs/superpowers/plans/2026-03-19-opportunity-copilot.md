# Opportunity Copilot Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an opportunity-scoped Backboard copilot, an interactive React Flow stakeholder graph, and a demo-only in-app email composer in the existing Next.js workspace.

**Architecture:** Keep mock opportunity data as the source of truth for the page while introducing a server-only Backboard API route for chat. Split the feature into focused helpers for context building, Backboard session caching, graph derivation, and email drafting so the UI remains composable and testable.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, `@xyflow/react`, Backboard API, Vitest

---

## Chunk 1: Test Harness And Data Helpers

### Task 1: Add test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json`
- Test: `lib/workspace/__tests__/workspace-context.test.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Add minimal Vitest configuration**
- [ ] **Step 4: Run test to verify it passes**

### Task 2: Build workspace context and graph helpers

**Files:**
- Create: `lib/workspace/workspace-context.ts`
- Create: `lib/workspace/stakeholder-graph.ts`
- Test: `lib/workspace/__tests__/workspace-context.test.ts`
- Test: `lib/workspace/__tests__/stakeholder-graph.test.ts`

- [ ] **Step 1: Write failing helper tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement minimal helper code**
- [ ] **Step 4: Run tests to verify they pass**

## Chunk 2: Backboard Route

### Task 3: Add Backboard session/cache helpers

**Files:**
- Create: `lib/backboard/client.ts`
- Create: `lib/backboard/session-cache.ts`
- Test: `lib/backboard/__tests__/session-cache.test.ts`

- [ ] **Step 1: Write failing cache tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement minimal cache helper**
- [ ] **Step 4: Run tests to verify they pass**

### Task 4: Add opportunity copilot API route

**Files:**
- Create: `app/api/opportunities/[id]/copilot/route.ts`
- Modify: `lib/workspace/workspace-context.ts`
- Test: `lib/workspace/__tests__/workspace-context.test.ts`

- [ ] **Step 1: Write/extend failing tests for request context formatting**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement the route using server-side `BACKBOARD_API_KEY`**
- [ ] **Step 4: Run tests to verify helpers pass**

## Chunk 3: UI Surfaces

### Task 5: Build email drafting state and shared composer

**Files:**
- Create: `components/workspace/email-composer-sheet.tsx`
- Create: `lib/workspace/email-drafts.ts`
- Test: `lib/workspace/__tests__/email-drafts.test.ts`

- [ ] **Step 1: Write failing email draft tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement the draft helper and composer UI**
- [ ] **Step 4: Run tests to verify they pass**

### Task 6: Build the React Flow stakeholder graph

**Files:**
- Create: `components/workspace/stakeholder-graph-card.tsx`
- Modify: `components/workspace/workspace-content.tsx`
- Modify: `app/globals.css`
- Test: `lib/workspace/__tests__/stakeholder-graph.test.ts`

- [ ] **Step 1: Extend graph helper tests if needed**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement the graph with accessible node actions**
- [ ] **Step 4: Run tests to verify helpers still pass**

### Task 7: Build the opportunity copilot panel

**Files:**
- Create: `components/workspace/opportunity-copilot.tsx`
- Modify: `components/workspace/workspace-content.tsx`
- Modify: `components/workspace/opportunity-header.tsx`

- [ ] **Step 1: Define the panel contract from existing helper behavior**
- [ ] **Step 2: Implement the minimal UI and API integration**
- [ ] **Step 3: Add loading/error states next to the interaction surface**
- [ ] **Step 4: Verify related tests still pass**

## Chunk 4: Verification

### Task 8: Final verification

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ignore any local Backboard cache file if one is added**
- [ ] **Step 2: Run `npm run lint`**
- [ ] **Step 3: Run `npm run build`**
- [ ] **Step 4: Report the verified status with evidence**
