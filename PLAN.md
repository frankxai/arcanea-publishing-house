# Arcanea Publishing House — Execution Plan (God Mode)

**Initiated:** 2026-06-18  
**Owner:** Frank (with swarm support)  
**Goal:** Deliver a complete, usable, replicable Publishing House system on Hermes/Arcanea.

## Phase 1 — Foundation (Now)
- [x] Architecture & plan documents
- [ ] Create GitHub repo: frankxai/arcanea-publishing-house
- [ ] Basic structure + README + docs
- [ ] Core SOUL for "Publishing House" profile
- [ ] Initial skills:
  - book-production-pipeline
  - social-agent-base
  - influencer-outreach
  - ad-campaign-orchestrator

## Phase 2 — Book Production Lane
- Manuscript ingestion skill
- Lore/world consistency checker (tie to Arcanea canon)
- Visual generation pipeline (ComfyUI + existing creative skills)
- Formatting & export (PDF/ePub + print specs)
- Test with one real or sample book project

## Phase 3 — Marketing & Promotion Swarm
- Campaign planner skill
- Ad copy + visual variant generator
- Influencer scout + pitch generator
- Basic outreach workflow (email/DM templates + tracking)

## Phase 4 — Social Media Agents
- Define 3-5 specialized social agents
- Gateway + MCP setup for X, Facebook, YouTube, etc.
- Cron schedules + autonomous posting/engagement rules
- Content repurposing loop (YouTube transcripts → threads → posts)

## Phase 5 — Orchestration & Integration
- Central orchestrator skill
- Task contract templates for publishing handoffs
- SIS memory integration (project graph for books + campaigns)
- Full Hermes profile distribution (distribution.yaml, skills/, mcp.json)
- Add to arcanea-agents registry

## Phase 6 — Polish, Replicability & Testing
- Complete docs: how to fork/copy for other creators
- Example swarm run (end-to-end with dummy or real small project)
- Update Arcanea wiki / AGENTS.md pointers
- Security: local-only credentials, no secrets in repo
- Performance: cron + delegation for long-running campaigns

## MCPs to Wire (Priority)
1. youtube-content (existing)
2. ComfyUI / image gen (existing creative)
3. Social (Facebook MCP from research, X via gateway)
4. Email / outreach
5. Any ad platform MCPs available June 2026
6. Arcanea native: SIS, lore, project graph

## Success Criteria
- One full book can be taken from manuscript to published + first marketing pulse autonomously.
- Swarm agents can post and manage social profiles with minimal oversight.
- A new user can install via Hermes profile and run a campaign in <30 min setup.
- System is fully documented for forking.

## Tools & Patterns to Use
- Hermes delegation + subagents
- Skills system (self-improving)
- Cron for scheduled work
- Profiles for "Publishing House" mode
- Existing Arcanea book/ lore infrastructure
- Creative skills (comfyui, humanizer, design)

Execute in god mode — build artifacts, not just plans.
EOF

echo "PLAN.md written"