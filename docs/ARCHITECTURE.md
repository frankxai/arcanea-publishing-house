# Arcanea Publishing House — Architecture

**Date:** 2026-06-18  
**Context:** Hermes Agent + Arcanea (local-first creative intelligence)  
**Goal:** A complete, replicable modern publishing house executed by a coordinated swarm of Hermes-powered agents.

## North Star
Turn a creator's raw ideas, lore, worlds, and manuscripts into:
- Professionally published books (print, digital, audio)
- Live marketing campaigns
- Influencer partnerships
- Autonomous social media presence
- Measurable results and compounding assets

All running locally/byok, using the full Hermes stack (skills, MCP, delegation, cron, memory/SIS, gateway).

## High-Level System

```
Creator Input (manuscript, brief, assets, goals)
          ↓
Arcanea Publishing House Orchestrator (Hermes profile)
          ↓
Multi-Agent Swarm (delegated sub-agents)
   ├── Book Production Lane
   ├── Design & Visuals Lane
   ├── Marketing & Ads Lane
   ├── Influencer & Outreach Lane
   └── Social Media Agents (autonomous profiles)
          ↓
MCP Connectors + External Tools
          ↓
Distribution + Campaigns + Analytics
          ↓
Feedback → Memory (SIS) + Skill Improvement
```

## Core Lanes & Workflows

### 1. Book Production Pipeline
- Ingestion: Manuscript (MD, DOCX, etc.) + lore/world context from SIS/Arcanea vault.
- Editing: Multiple editors (structural, line, consistency with canon).
- World/Lore Guard: Use Arcanea bestiary/lore agents to enforce consistency.
- Visuals: Covers, illustrations, maps via ComfyUI / Higgsfield / other MCPs.
- Formatting: PDF, ePub, print-ready (use existing Arcanea book tools).
- Distribution prep: Metadata, ISBN handling (manual or connector), upload scripts.

Skills involved: book-production, lore-consistency, cover-generator, formatter.

### 2. Marketing & Advertisement
- Campaign strategy generator.
- Ad copy + visual variants (humanizer + design skills).
- Ad platform connectors (Facebook/Instagram via MCP, Google Ads if available, etc.).
- Performance tracking via cron + memory.

### 3. Influencer Outreach
- Scout + rank influencers (research agents + web tools).
- Personalized pitch generation (using creator voice + project data).
- Email / DM sequencing (email MCP or gateway).
- Relationship tracking in SIS/project graph.

### 4. Social Media Swarm
- Each "Sun Agent" or specialized agent has:
  - Own SOUL/personality.
  - Access to one or more social accounts (via Hermes gateway or dedicated MCPs: X, Facebook, YouTube, etc.).
  - Posting schedule (cron).
  - Engagement rules (reply, repost, thread creation).
  - Content repurposing (youtube-content skill + humanizer).
- Examples:
  - @BookLuminor: Posts excerpts, behind-the-scenes, lore drops.
  - @AdAlchemist: Runs promo threads and ad teasers.
  - Creator's own voice agent for authenticity.

### 5. Orchestration & Coordination
- Central "Publisher" agent (top-level Hermes instance or dedicated profile).
- Uses `delegate_task` for parallel workstreams.
- Task contracts for handoffs (provenance).
- Cron for daily briefs, campaign pulses, social schedules.
- Memory: SIS project graph + campaign memory.
- Self-improving: Complex tasks → new skills.

## MCP Connectors (as of June 2026)
- **Content**: youtube-content, web search, browser.
- **Social**: Facebook MCP, X/Twitter (via gateway or custom), YouTube upload.
- **Email/Outreach**: Email MCPs or Hermes gateway.
- **Ads**: Facebook/Instagram Ads (Composio-style), potential Google/others.
- **Creative**: ComfyUI (images/video), songwriting for audio books/trailers.
- **Storage/Distribution**: Supabase/Notion (from Arcanea), file ops, Git for versions.
- **Analytics**: Custom or platform APIs.
- **Arcanea Native**: SIS memory MCP, lore agents, project graph.

Registry of connectors lives in `mcp-connectors/`.

## Swarm Agent Definitions (High Level)

- **Publisher Orchestrator**: Overall strategy, task decomposition, quality gates.
- **Editor-in-Chief**: Structural + consistency editing.
- **Line Editor + Humanizer**: Voice and prose polish.
- **Visual Director**: Covers, maps, marketing visuals (ComfyUI workflows).
- **Marketer**: Campaign planning, copy, A/B variants.
- **Influencer Scout**: Research + outreach.
- **Ad Runner**: Platform-specific ad creation and launch.
- **Social Agents** (multiple):
  - Book Evangelist
  - Lore Keeper
  - Promo Alchemist
  - Each can have independent profiles via gateway.

Each agent is implemented as a skill + SOUL.md + config.

## Replicability & Forking
- Everything is defined in this repo + Hermes profile distribution.
- To replicate:
  1. Install base Arcanea Agent profile.
  2. Install publishing-house profile (distribution.yaml).
  3. Configure your MCPs and social credentials (local only).
  4. Run `hermes -p publishing-house` or dedicated commands.
- Full docs + templates in `docs/`.
- Open source so others can build their own houses.

## Integration Points
- With existing Arcanea: Book vault, lore, research agents, world engine.
- With Hermes: Full delegation, skills system, cron, memory nudges.
- With arcanea-agents registry: List specialized agents/profiles here.

## Next Execution (God Mode)
See `../PLAN.md` and todo tracker.

This is designed to be a living, growing system — agents create new skills as they publish.
EOF

echo "ARCHITECTURE.md written"