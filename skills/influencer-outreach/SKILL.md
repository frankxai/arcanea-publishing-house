---
name: influencer-outreach
category: publishing
version: 0.1.0
description: Scout, qualify, and pitch influencers for book launches and campaigns using web, X, and email MCPs.
author: Arcanea Publishing House
trust: local
---

# Influencer Outreach Skill

Scouts influencers aligned with the book's world/genre, generates personalized pitches, tracks responses.

## Usage
```bash
hermes -p publishing-house skill run influencer-outreach \
  --book "The Marked" \
  --niche "fantasy, worldbuilding, books" \
  --count 20
```

## Workflow
1. Scout via X search, web search, Arcanea Registry if applicable.
2. Analyze profiles for fit (audience overlap, past collabs, voice match).
3. Generate personalized pitch using book lore + creator voice.
4. Send via email MCP or social DM.
5. Log to SIS with provenance and follow-up schedule.

## Outputs
- Qualified list with scores
- Draft pitches
- Outreach log in SIS
- Task contract for follow-up

Integrates with MarketingOrchestrator and SwarmSocial.