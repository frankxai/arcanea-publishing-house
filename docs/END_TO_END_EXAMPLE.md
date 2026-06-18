# End-to-End Example: Publishing "The Marked" (Sample Run)

## 1. Ingest & Plan
publishing-house chat
> /publish-book ./manuscripts/the-marked.md --world "The Marked" --goal "Launch with influencer + ad pulse"

House decomposes into task contracts:
- SunEditor: Developmental edit + lore check
- ProductionLuminor: Cover + interiors via ComfyUI
- ...

## 2. Production Lane
skill run book-production-pipeline --manuscript ./the-marked.md --world "The Marked"

Result: Formatted ePub/PDF, 12 assets, SIS entry with full provenance.

## 3. Marketing Swarm
skill run ad-campaign-orchestrator --book "The Marked" --budget 800 --platforms "x,instagram,meta"

- Variants generated
- Budget allocated

## 4. Influencer
skill run influencer-outreach --book "The Marked" --niche "fantasy books"

- 18 influencers scouted
- 7 personalized pitches sent via email MCP
- Logged in SIS

## 5. Social Activation
skill run swarm-social-poster --agent SunVoice --schedule "launch-week"

SunVoice (with its own @SunVoice_Arcanea profile):
- Posts lore thread from book
- Repurposes YouTube trailer transcript
- Engages replies autonomously per rules

ThreadWeaver creates 4 repurposed pieces from production assets.

## 6. Launch & Track
- Distribution skill prepares KDP + Gumroad
- Cron runs daily reports to SIS
- After 7 days: House proposes new skills from performance data

Full provenance in SIS project graph. Creator reviews via /insights.

This is replicable — run the same with your manuscript.