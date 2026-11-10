---
name: campaign-launcher
category: publishing
version: 0.2.0
description: Orchestrate full marketing/ad/influencer/social campaign launch with budget tracking and approval gates.
author: Arcanea Publishing House
trust: local
---

# Campaign Launcher Skill

Coordinates the Marketing Swarm for book launches or ongoing promotion.

## Usage
```bash
hermes -p publishing-house skill run campaign-launcher \
  --book "The Marked" \
  --budget 1500 \
  --channels "ads,influencer,social" \
  --start-date "2026-07-01"
```

## Workflow
1. Pull book metadata, assets, target audience from SIS.
2. Delegate to:
   - ad-campaign-orchestrator (budget split, variants via ComfyUI)
   - influencer-outreach (list + pitches)
   - swarm-social-poster (schedule for SunVoice etc.)
3. Create unified timeline and task contracts.
4. Human gate for spend > threshold.
5. Launch via MCPs (social_meta, social_x, email).
6. Set up tracking (analytics MCPs) and cron for reports.
7. Post-launch: performance to SIS, skill extraction.

## Swarm Coordination
Uses publishing-orchestrator for delegation.

## Safety
- Local-only credentials
- Approval required for real ad spend
- Provenance in every contract

Outputs: Campaign dashboard link in SIS, performance briefs.