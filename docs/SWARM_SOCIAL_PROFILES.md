# Swarm Sun Agents & Social Profiles

## Concept
Each specialized agent in the Publishing House swarm can have (or share) dedicated social media identities.

This allows:
- Consistent voice per role (e.g. SunVoice posts mythic lore threads).
- Autonomous operation via cron + skills.
- Clear provenance (posts attributed to the agent + book project in SIS).

## Configuration
1. Define in `agents/<AgentName>/persona.json`:
   - platforms and handles
   - voice rules
   - content sources

2. Add tokens to the profile's local `.env`:
   ```
   SUNVOICE_X_TOKEN=...
   THREADWEAVER_IG_TOKEN=...
   ```

3. Wire MCPs in mcp.json (social_x, social_meta, etc.).

4. Use `social-profile-manager` + `swarm-social-poster` skills.

## Example Flow
- Orchestrator creates campaign.
- Delegates to SunVoice for social amplification.
- SunVoice uses its persona + tokens to post via MCP.
- Engagement comes back into SIS for the book project.
- Performance data used to improve the skill.

## Management
- View active agents: inside publishing-house profile `/list-swarm`
- Update persona: edit the json + restart profile
- Rotate tokens: local .env only
- Pause social: skill with --pause flag or cron disable

Fully managed inside the Hermes profile. Replicable when you fork the distribution.