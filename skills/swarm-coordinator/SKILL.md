---
name: swarm-coordinator
category: publishing
version: 0.2.0
description: Central swarm orchestration, task decomposition, delegation to Sun Agents, monitoring and self-improvement loops.
author: Arcanea Publishing House
trust: local
---

# Swarm Coordinator Skill

The runtime brain for the Publishing House swarm.

## Usage (often called by publishing-orchestrator or directly)
```bash
hermes -p publishing-house skill run swarm-coordinator \
  --goal "full book launch for The Marked" \
  --agents "SunEditor,ProductionLuminor,SunVoice,InfluencerScout"
```

## Core Logic
- Decompose high-level goal into task contracts (using proven patterns from Arcanea).
- Assign to specialized agents (Sun* or skills).
- Use Hermes delegation for parallel execution.
- Monitor via cron + SIS queries.
- On completion: aggregate results, log provenance, propose new skills or persona updates.
- Handle social profile handoffs (via social-profile-manager).

## Integration
- Calls other skills (book-*, campaign-*, social-*).
- Maintains project graph in SIS.
- Supports cron for ongoing social/engagement.

## Self-Improvement
After every major run, extract learnings into new SKILL.md or persona tweaks.

This skill makes the "multiple systems" come together as one coherent Publishing House.