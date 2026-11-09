# Arcanea Publishing House

A local-first publishing profile and capability pack for turning manuscripts, knowledge and original worlds into reviewed books, workbooks, audio packets and distribution-ready editions.

## Honest current state

This repository is a capability scaffold. It contains publishing, campaign, outreach and social skills plus example agent personas. Optional MCP, social, ad, email, creative and distribution integrations are not assumed installed or authorized. A generated artifact is not a published book, sent campaign or completed platform action.

## Product family

See PRODUCTS.md for AuthorOS Starter, Living Guide Forge, World Bible, Learner & Teacher, Audiobook/Trailer and team-studio editions. Each release uses product.manifest.yaml plus the rights, format, distribution and evidence gates in docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md.

## Quick Start

```bash
# Launch the house
hermes -p publishing-house chat

# Or run the full end-to-end workflow (bash or PowerShell)
./docs/example-workflow.sh "Your Book Title" ./path/to/manuscript.md 1500
# Windows: ./docs/example-workflow.ps1 -BookTitle "Your Book" -Manuscript ".\ms.md" -Budget 1500
```

See the installed profile for `.env.EXAMPLE` (copy to `.env` and fill keys for real social/MCP use).

## Workflow

Manuscript or source brief → structural edit → source/canon review → line edit → design and media → PDF/EPUB/print/audio validation → rights review → release candidate → authorized submission → listing verification → outcomes and maintenance.

Agents may prepare and validate reversible artifacts. Human approval is required for account agreements, ISBN decisions, public prices, platform submissions, ads and spend, outreach, social publication, partner claims and rights declarations.

## Install and verify

Review distribution.yaml, mcp.json and every requested permission before installing as a Hermes profile. Configure credentials only through local/provider-approved secret storage; never commit them. The pack requires Hermes 0.16 or later, but each connector must be installed and verified separately.

Before a release, validate YAML and local links, run the relevant skill checks, inspect every exported file, bind evidence to the edition checksum and record the actual completion state.

## Architecture

ARCHITECTURE.md describes the intended producer lanes. AGENTS.md and docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md define what may be claimed and which actions remain human-gated.

- **SunEditor** — Developmental editing + lore/canon guard.
- **ProductionLuminor** — Visuals, formatting, production.
- **SunDistributor** — KDP, print, digital storefronts, metadata, pricing.
- **MarketingOrchestrator** — Campaigns, ads, copy.
- **InfluencerScout** — Discovery + personalized outreach.
- **SwarmSocial Agents** (SunVoice, ThreadWeaver, EngagementSentinel) — Post and manage dedicated social profiles with consistent personas.

All orchestrated by the central Publishing House profile using Hermes delegation, task contracts, cron, and SIS memory.

## Key Capabilities

- End-to-end book pipeline with Arcanea lore/world consistency (ties to SIS, bestiary, project graphs).
- Multi-channel marketing (organic social + paid ads + influencer).
- Content repurposing (YouTube → threads → posts → ads).
- Provenance & task contracts for every handoff.
- Self-improving skills after every campaign.
- Fully replicable — fork the profile and run your own house.

**Core Skills** (run with `hermes -p publishing-house skill run <name>`):
- `book-production-pipeline`
- `book-distributor`
- `campaign-launcher`
- `swarm-coordinator`
- `influencer-outreach`
- `ad-campaign-orchestrator`
- `swarm-social-poster`
- `social-profile-manager`
- `publishing-orchestrator`

## MCP Connectors

Configured via `mcp.json`:
- youtube-content (repurposing)
- ComfyUI / higgsfield / fal (covers, assets)
- SIS memory & Arcanea Registry (lore, projects, skills)
- Social posting (X, Facebook/IG, etc.)
- Email outreach
- Ad platforms
- Book distribution (KDP + others via browser/MCP)

## Status

See `PUBLISHING_HOUSE_STATUS.md` and `PLAN.md` for current state.
