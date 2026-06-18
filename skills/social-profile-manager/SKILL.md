---
name: social-profile-manager
category: publishing
version: 0.1.0
description: Manage dedicated social identities and posting rules for Swarm Sun Agents (X, IG, YouTube, etc.).
author: Arcanea Publishing House
trust: local
---

# Social Profile Manager

Gives Swarm Sun Agents their own persistent social profiles/handles with rules, tokens (local), and scheduling.

## Usage
```bash
hermes -p publishing-house skill run social-profile-manager \
  --agent SunVoice \
  --action setup --platform x --handle "@SunVoice_Arcanea"

hermes -p publishing-house skill run social-profile-manager --agent ThreadWeaver --action schedule --daily
```

## How It Works
- Agent persona.json defines voice + platforms.
- Tokens stored in profile .env (e.g. SUNVOICE_X_TOKEN) — never in repo.
- MCPs (social_x, social_meta) handle actual posting.
- Cron + swarm-social-poster skill runs autonomous activity.
- All posts logged to SIS with provenance.

## Swarm Sun Agents with Own Profiles
- SunVoice: Brand storyteller with its own X/IG accounts.
- ThreadWeaver: Repurposing agent that posts as "the making of" voice.
- EngagementSentinel: Community reply agent.

They can appear as distinct creators or the house voice while coordinated by the central Publishing House orchestrator.

## Replicable
Fork the profile, customize personas/handles, add your tokens locally. Same for any creator's house.