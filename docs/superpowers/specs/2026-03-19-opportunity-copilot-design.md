# Opportunity Copilot Design

## Goal

Add a demo-ready opportunity workspace that keeps the existing mock data model, upgrades the stakeholder section into an interactive React Flow graph, and introduces a Backboard-powered copilot chat with opportunity-scoped memory and in-app email drafting.

## Scope

- Keep the route at `app/app/workspace/[id]/page.tsx`
- Preserve mock data in `app/lib/mock-data.ts` for opportunity, evidence, task, and stakeholder content
- Add one real AI integration: Backboard chat with server-side API key usage and memory enabled
- Add a shared in-app email composer reachable from both the chat and the stakeholder graph
- Fix the current detail-page layout issues by reorganizing the workspace into clearer sections

## Architecture

### Workspace layout

The workspace remains a single page for a selected opportunity. The page is rebalanced into three coordinated areas:

- left rail for opportunity summary and evidence cards
- center canvas for a React Flow stakeholder graph
- right rail for the copilot chat and drafted actions

This keeps the strongest existing demo content while making the stakeholder map and AI interaction the primary experience.

### AI copilot

The copilot is opportunity-scoped. It receives structured context derived from the selected opportunity, stakeholders, evidence, gaps, and tasks. The API route talks to Backboard from the server only, using the `BACKBOARD_API_KEY` environment variable and `memory: "Auto"`.

To make the demo feel persistent, the implementation should reuse one assistant and one thread per opportunity where possible. Since there is no backend database, a small local cache file can persist assistant/thread IDs between dev-server reloads.

### Email drafting

Email is a demo-only in-app compose experience. The copilot and stakeholder graph can both request a draft. The composer opens with prefilled recipient, subject, and body. A `Send` action confirms success in the UI but does not contact a real provider.

### Stakeholder semantics

Stakeholder roles remain demo data but should be explained consistently in the UI:

- champion: internal advocate pushing the deal forward
- economic buyer: person controlling budget or approval
- evaluator: technical or operational reviewer
- gatekeeper: person controlling access or process
- procurement: formal purchasing owner

Graph edges should emphasize influence and process rather than claiming certainty beyond the mock data.

## Error handling

- Missing API key should surface an inline copilot error
- Backboard failures should not break the rest of the page
- Email composer should always allow manual edits even if AI draft generation fails
- Empty graph states should offer a clear call to action

## Testing

- Add test coverage for opportunity context building and graph derivation helpers
- Add test coverage for thread cache behavior and email draft generation helpers where practical
- Verify lint and production build after implementation
