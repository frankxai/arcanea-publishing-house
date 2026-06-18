---
name: swarm-social-poster
category: publishing
version: 0.1.0
description: Autonomous social posting and engagement for Swarm Sun Agents with dedicated profiles.
author: Arcanea Publishing House
trust: local
---

# Swarm Social Poster

Enables Swarm Sun Agents to post and engage on social platforms with consistent personas.

## Usage

```bash
# Run a specific agent
hermes -p publishing-house skill run swarm-social-poster --agent SunVoice --content "new chapter excerpt"

# Start scheduled mode
hermes -p publishing-house skill run swarm-social-poster --schedule daily --agent ThreadWeaver
```

## How Agents Get Social Profiles

Each agent has a persona config:
- `agents/SunVoice/persona.json` — voice, topics, rules.
- Local tokens: `SUNVOICE_X_TOKEN`, `SUNVOICE_IG_TOKEN` etc. (in profile .env).

Posting happens via:
- Social MCPs (X, Facebook, etc.).
- Hermes gateway for messaging platforms.
- Browser automation for complex cases.

## Features
- Content repurposing (book → thread, YouTube transcript → post).
- Scheduled via cron.
- Engagement rules (reply style, hashtags, calls to action).
- Provenance logging to SIS.
- Performance feedback loop for self-improvement.

## Supported Platforms (expand via MCPs)
- X / Twitter
- Instagram / Facebook
- YouTube (via youtube-content MCP)
- LinkedIn, TikTok, etc.

Agents appear as distinct voices while coordinated by the central Publishing House.