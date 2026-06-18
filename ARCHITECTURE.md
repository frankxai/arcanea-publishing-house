# Arcanea Publishing House — Complete Architecture (God Mode)

**Status:** Evolving live system (2026-06-18 onward)  
**Foundation:** Hermes Agent (profile + skills + MCPs + delegation + cron)  
**Philosophy:** One coordinated "Publishing House" that feels like a modern professional operation — but fully agentic, local-first, BYOK, replicable, and powered by Arcanea creative intelligence.

## Vision
A single installable system that lets any Arcanean creator (or team) run a full publishing operation:
- Take a manuscript (or world seed) → published book (digital + print).
- Launch coordinated marketing (ads + influencer + organic social).
- Maintain living social presences via specialized "Swarm Sun Agents" that have their own voices/profiles.
- All workflows are composable, auditable via task contracts + provenance, and improve themselves.

The system is **not** a single giant agent. It is a **swarm of specialized agents + workflows + connectors** orchestrated through Hermes.

## Core Principles (Non-Negotiable)
- **Profile-first & replicable** — Install via `hermes profile install ...` like Arcanea Agent. Others can fork the entire house.
- **Swarm over monolith** — Editor, Marketer, Influencer Scout, Social Poster, Distributor, Analyst agents.
- **MCP-native** — Heavy use of June 2026+ MCP ecosystem (YouTube content, ComfyUI visuals, SIS memory, social posting, ads, email, Arcanea Registry).
- **Task contracts + provenance** — Every handoff is a contract. Everything is traceable in SIS/project graph.
- **Social agents with identity** — Swarm Sun Agents can manage dedicated social profiles (X, IG, YouTube, etc.) with consistent persona.
- **Local-first + BYOK** — No forced cloud. Credentials stay local. Use any model/provider.
- **Self-improving** — After campaigns/books, the system extracts new skills.
- **Arcanea soul** — Lore/world consistency, creative excellence, long-term compounding for creators.

## High-Level Components

### 1. Publishing House Profile (Core Installable Unit)
- SOUL.md — The "Publishing House" persona (already exists, evolve it).
- distribution.yaml + skills/ + mcp.json + config defaults.
- One-command install that wires the full swarm.

### 2. Swarm Agents (Specialized Sun Agents)
Each agent has:
- Dedicated SOUL/persona.
- Access to relevant MCPs/tools.
- Ability to run as subagent via Hermes delegation.
- Optional "social identity" (own posting schedule + profile config).

Examples:
- **SunEditor** — Manuscript ingestion, developmental editing, lore/canon checks (ties to Arcanea bestiary/lore).
- **ProductionLuminor** — Visuals (covers, interiors via ComfyUI/Higgsfield), formatting (PDF/ePub/print specs), metadata.
- **Distributor** — KDP/Ingram/Gumroad/Shopify connectors, pricing, launch sequencing.
- **MarketingOrchestrator** — Campaign planning, ad copy/variants, budget allocation.
- **InfluencerScout** — Web/X/search MCPs to find and pitch influencers; generates personalized outreach.
- **SwarmSocial Agents** (multiple):
  - SunVoice (brand voice for the book/house).
  - ThreadWeaver (long-form repurposing from YouTube/book content).
  - EngagementSentinel (replies, community management).
  - They use Hermes gateway + social MCPs to post/engage as distinct profiles.

Agents can "own" social accounts via:
- Dedicated API tokens in local .env (per agent or shared with persona).
- Browser automation MCP for platforms without good APIs.
- Gateway routing so the agent appears as itself in conversations.

### 3. Workflows (End-to-End Lanes)
**Book Production Lane**
1. Ingest manuscript (or world seed from Arcanea).
2. Developmental edit + lore consistency (SunEditor + SIS).
3. Visual pipeline (ComfyUI + existing creative skills).
4. Formatting + export.
5. Distribution setup + launch.

**Marketing Swarm Lane**
1. Campaign brief from book metadata + creator goals.
2. Ad variants + visuals.
3. Influencer list + personalized pitches.
4. Ad launch + tracking.
5. Organic social amplification via SwarmSocial agents.

**Social Presence Management (Ongoing)**
- Cron-scheduled posting.
- Content repurposing loops (book excerpt → thread → short video script → post).
- Performance feedback into SIS for self-improvement.

**Orchestration Layer**
- Central "Publisher" agent (the profile itself) that decomposes goals into task contracts.
- Hermes delegation for parallel execution.
- Cron for scheduled campaigns/social.
- SIS/project graph for memory across books/campaigns.

### 4. Connectors & MCPs (June 2026+ Ecosystem)
Core wired MCPs (expandable):
- **youtube-content** — Transcripts → repurposed content.
- **comfyui / higgsfield / fal** — Covers, marketing visuals, illustrations.
- **sis_memory / arcanea_registry** — Project graphs, lore, skills, living memory.
- **social_posting** (X, Facebook/IG, LinkedIn, YouTube via gateway or dedicated MCPs).
- **email_outreach** (Himalaya or equivalent for influencer pitches).
- **ad_platforms** (Meta, Google, TikTok ads MCPs when available).
- **book_distribution** (KDP API, IngramSpark, Draft2Digital via custom MCPs or skills + browser).
- **analytics** (Social insights, ad performance, sales tracking).
- **Arcanea-native**: lore consistency, world engine, task contracts.

New MCPs/skills to build:
- `book-formatter` (internal skill + MCP wrapper).
- `influencer-scout` (web search + X search + profile analysis).
- `ad-variant-generator`.
- `social-persona-manager` (manages agent social identities/configs).
- `provenance-publisher` (embeds contracts/metadata into books).

### 5. Replicability & Forking
- Full profile distribution (like arcanea-agent-profile).
- `arcanea-agents` registry entry for "publishing-house" and individual swarm agents.
- Clear docs: "How to spin up your own Publishing House".
- Skills are self-contained and publishable.
- Example end-to-end run included.
- Security: All secrets local; no repo secrets.

## Technology Stack & Coordination
- **Hermes Agent** as the runtime (CLI + gateway + delegation + cron + skills + memory).
- **Arcanea Agent profile** as the creative base (SOUL, lore tools, SIS).
- **MCP servers** for external capabilities.
- **Swarm via delegation** + task contracts (provenance).
- **SIS** for cross-book/campaign memory and project graphs.
- **Arcanea creative primitives** (worldbuilding, humanizer, visual factory).

**How Swarm Sun Agents Get Social Profiles**
1. Define persona in agent config (name, voice, posting rules).
2. Store platform auth in local profile .env (e.g., `SUNVOICE_X_TOKEN`).
3. Use social MCP or Hermes gateway to post.
4. Agent "remembers" its posts and engagement via SIS.
5. Cron + skills handle autonomous operation.

Example: A SunVoice agent can run `hermes -p publishing-house chat` with context "You are SunVoice for the book *The Marked*. Post a thread about chapter 3 lore."

## Execution & Management
- **Central control**: `hermes -p publishing-house` launches the house.
- **Swarm launch**: `/publish-book [manuscript]` or `/launch-campaign`.
- **Monitoring**: Cron reports, SIS queries, `/status`.
- **Self-evolution**: After every major run, the orchestrator proposes new skills.
- **Human oversight gates**: Approval for ad spend, final publish, influencer outreach.

## Success Metrics (God Mode)
- End-to-end: Manuscript → published book + first ad/social pulse with <2 hours active human time.
- Swarm agents maintain consistent voices on social with measurable engagement.
- A new creator installs the profile and runs a full lane in one session.
- The entire system is forkable and documented so others can run their own "Arcanea Publishing House".

This is the modern publishing house reimagined for the agentic era — coordinated, creative, compounding, and copyable.

Evolve this document as the system grows.