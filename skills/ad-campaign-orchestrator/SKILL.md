---
name: ad-campaign-orchestrator
category: publishing
version: 0.1.0
description: Plan, generate variants, launch and optimize ad campaigns across platforms for book launches.
author: Arcanea Publishing House
trust: local
---

# Ad Campaign Orchestrator

Coordinates paid advertising as part of the Marketing Swarm.

## Usage
```bash
hermes -p publishing-house skill run ad-campaign-orchestrator \
  --book "The Marked" \
  --budget 1200 \
  --platforms "meta,x,google" \
  --goal "pre-order + awareness"
```

## Steps
1. Analyze book metadata + target audience (from SIS).
2. Generate ad copy + visuals variants (ties to ComfyUI).
3. Allocate budget across platforms.
4. Create campaigns via ad MCPs (Meta, etc.).
5. Set up tracking + SIS logging.
6. Schedule optimization loops (A/B, retargeting).

## Swarm Integration
Works with InfluencerScout and SwarmSocial for amplification.

Outputs task contracts and performance data for self-improvement.