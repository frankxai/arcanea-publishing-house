# Replicability Guide — Run Your Own Arcanea Publishing House

**Goal:** Any creator can install or fork this system and run a professional publishing operation with minimal setup.

## 1. Install the Base (Fastest Path)

```bash
# Requires Hermes + Arcanea Agent profile already set up
hermes profile install github.com/frankxai/arcanea-publishing-house --name my-publishing-house --alias --force -y

hermes -p my-publishing-house chat
```

This brings:
- SOUL (Publishing House persona)
- Core skills (book pipeline, marketing swarm, social agents)
- MCP wiring
- Example workflows

## 2. Wire Your Connectors (MCPs & Credentials)

Edit the profile's `.env` (local only):

```
# Social
X_API_KEY=...
FACEBOOK_ACCESS_TOKEN=...

# Image/Visual
COMFYUI_URL=http://localhost:8188

# SIS / Memory (for lore + project graphs)
ARCANEA_SIS_HOME=/path/to/your/sis

# Ad & Distribution (when MCPs are available)
META_ADS_TOKEN=...
KDP_CREDENTIALS=...   # or use browser MCP
```

Enable/disable MCPs in the profile's `mcp.json`.

## 3. Customize for Your World/Creative Work

- Replace or extend `SOUL.md` with your brand voice.
- Add domain-specific skills (e.g., fantasy editing rules, music album "publishing" lane).
- Point to your SIS/world for lore consistency.
- Define your Swarm Sun Agents' social personas.

## 4. Fork & Own It Completely

```bash
git clone https://github.com/yourname/arcanea-publishing-house my-house
cd my-house

# Customize
# - Update distribution.yaml
# - Add your skills in skills/
# - Extend mcp.json
# - Write your SOUL.md

# Publish your version as a profile (see arcanea-agent-profile model)
hermes profile install . --name my-house --force
```

## 5. Swarm Social Profiles

Each Swarm Sun Agent can have its own identity:

- Create `agents/SunVoice/` with its own SOUL and posting rules.
- Store its tokens separately (e.g., `SUNVOICE_X_TOKEN`).
- Schedule via cron in the profile.

Example autonomous behavior:
- ThreadWeaver wakes up, pulls new YouTube transcript or book chapter, creates 5 posts, proposes schedule.
- You approve or let it run with rules.

## 6. Full End-to-End Example

See `examples/full-book-launch.md` (to be expanded with real run logs).

## 7. Making It Your Own

- Add new MCPs as they appear in the 2026 ecosystem.
- Create custom agents for your niche (music releases, game books, courses as "books").
- Integrate your existing tools (Notion, Linear, email lists).
- Publish your improved skills back to the Arcanea registry so the ecosystem grows.

The system is deliberately open and profile-based so the entire "house" can be copied, specialized, and improved by anyone.

Build your publishing empire — agentically.