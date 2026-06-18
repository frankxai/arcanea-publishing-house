# Arcanea Publishing House

**The complete, agentic, replicable modern publishing system — built on Hermes Agent + MCPs + Arcanea creative intelligence.**

One install. A full swarm of specialized agents that handles:
- Book production (manuscript → published)
- Marketing campaigns
- Influencer outreach
- Ad execution
- Autonomous social media management (Swarm Sun Agents with their own profiles/voices)

Local-first. BYOK. Self-improving. Designed so you (or anyone) can run a professional-grade publishing operation.

## Quick Start (God Mode)

```bash
# Install the full Publishing House as a Hermes profile
hermes profile install github.com/frankxai/arcanea-publishing-house --name publishing-house --alias --force -y

# Launch the house
publishing-house chat

# Example commands inside
/publish-book path/to/manuscript.md --world "The Marked"
/launch-campaign "The Marked" --budget 500 --platforms "x,instagram"
/swarm-social start --agent SunVoice
```

See [docs/INSTALL.md](docs/INSTALL.md) for full setup (MCPs, credentials, SIS integration).

## The Ecosystem

- **arcanea-agent** — The creative intelligence runtime (Hermes fork).
- **arcanea-agent-profile** — Base Arcanea creative profile.
- **arcanea-agents** — Registry of agents (publishing-house lives here too).
- **arcanea-publishing-house** (this) — The full coordinated publishing system.

## How It Works (Swarm Model)

Not one agent. A coordinated swarm:

- **SunEditor** — Developmental editing + lore/canon guard.
- **ProductionLuminor** — Visuals, formatting, production.
- **Distributor** — KDP, print, digital storefronts.
- **MarketingOrchestrator** — Campaigns, ads, copy.
- **InfluencerScout** — Discovery + personalized outreach.
- **SwarmSocial Agents** (SunVoice, ThreadWeaver, EngagementSentinel) — Post and manage dedicated social profiles with consistent personas.

All orchestrated by the central Publishing House profile using Hermes delegation, task contracts, cron, and SIS memory.

Agents can have real social identities:
- Dedicated platform tokens/configs (local only).
- Persona SOULs.
- Scheduled autonomous activity via cron + skills.

## Key Capabilities

- End-to-end book pipeline with Arcanea lore/world consistency.
- Multi-channel marketing (organic social + paid ads + influencer).
- Content repurposing (YouTube → threads → posts → ads).
- Provenance & task contracts for every handoff.
- Self-improving skills after every campaign.
- Fully replicable — fork the profile and run your own house.

## MCP Connectors (June 2026+)

Wired by default (expandable):
- youtube-content (repurposing)
- ComfyUI / image & video gen (covers, assets)
- SIS memory & Arcanea Registry (lore, projects, skills)
- Social posting (X, Facebook/IG, etc.)
- Email outreach
- Ad platforms
- Book distribution (KDP + others)

See `mcp.json` and docs/MCP.md.

## Replicability

Everything is built to be copied:
- Install via Hermes profile.
- Full docs + example runs.
- Skills are standalone and publishable.
- Add your own MCPs or agents.
- Fork `arcanea-publishing-house` and customize the SOUL/workflows.

See `docs/REPLICABILITY.md` for exact steps to spin up your own publishing house.

## Next Evolution

This is live and evolving. Current focus:
- Full book production lane.
- Working social swarm with real profiles.
- Influencer + ad orchestration.
- End-to-end example run.

Contributions and forks welcome. The goal is a whole ecosystem of replicable creative publishing operations.

Built with Arcanea soul on the Hermes foundation.

Local-first. Creator-first. Compounding.