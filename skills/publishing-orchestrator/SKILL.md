---
name: publishing-orchestrator
category: publishing
version: 0.1.0
description: Central coordinator that decomposes goals into swarm task contracts and manages the full house.
author: Arcanea Publishing House
trust: local
---

# Publishing Orchestrator

The brain of the Publishing House. Delegates to specialized agents and tracks everything in SIS.

## Usage
Inside publishing-house profile:
```
/publish-book manuscript.md --world "Your World"
```

Or direct:
hermes -p publishing-house skill run publishing-orchestrator --goal "full launch for The Marked"

## Responsibilities
- Goal decomposition into task contracts
- Agent delegation (SunEditor, ProductionLuminor, SwarmSocial, etc.)
- Cron scheduling for social/ads
- Provenance and SIS updates
- Post-campaign skill extraction

This is the entry point for most publishing house operations.