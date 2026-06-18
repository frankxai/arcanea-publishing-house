---
name: social-agent-base
description: "Base for autonomous social media agents. Each can have personality, posting schedule, and direct access to platforms via Hermes gateway or MCPs."
category: publishing
version: 0.1.0
---

# Social Agent Base

Used to spin up specialized social agents (Book Evangelist, Lore Keeper, Promo Alchemist, etc.).

## How it Works
- Each instance gets its own SOUL.md defining voice, goals, rules.
- Uses Hermes gateway for Telegram/Discord/X/Facebook etc. or dedicated MCPs.
- Cron-driven or event-triggered.
- Content creation via repurposing skills (youtube-content, humanizer, design).
- Engagement rules defined in config.
- Memory: Campaign/project graph in SIS.

## Example Specialization
Create a new skill:
```yaml
name: book-evangelist
extends: social-agent-base
soul: |
  You are the Book Evangelist for [Project].
  Voice: [creator voice or specific].
  Goals: Share excerpts, build hype, engage community.
  Platforms: X, Instagram via gateway.
```

## Management
- Agents can run in parallel via delegation.
- One "Publisher" orchestrator coordinates.
- Each can have "own" social profile (credentials local, managed by Hermes).

## Replicability
Fork, define new SOULs, wire MCPs, done.
