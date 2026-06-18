---
name: book-production-pipeline
category: publishing
version: 0.1.0
description: End-to-end manuscript to published book pipeline with Arcanea lore/world consistency.
author: Arcanea Publishing House
trust: local
---

# Book Production Pipeline

Takes a manuscript (or world seed) and runs the full production lane using the Publishing House swarm.

## Usage

```bash
hermes -p publishing-house skill run book-production-pipeline \
  --manuscript path/to/manuscript.md \
  --world "The Marked" \
  --output ./published
```

## Steps (Orchestrated via Task Contracts)

1. **Ingestion** — Parse manuscript, extract metadata, chapters, world elements. Store in SIS project graph.
2. **Developmental Edit (SunEditor)** — Developmental feedback, lore/canon consistency checks against Arcanea bestiary/lore. Humanizer pass for voice.
3. **Visual Production** — Generate cover, interior art, marketing assets via ComfyUI / Higgsfield / existing creative MCPs. Consistent style from world bible.
4. **Formatting & Export** — PDF, ePub, print-ready specs. Metadata embedding (provenance, ISBN placeholders).
5. **Distribution Prep** — KDP/Ingram/Gumroad metadata, pricing recommendations, launch checklist.
6. **Handoff** — Create task contracts for Marketing and Social swarms. Update SIS with full provenance.

## Inputs
- manuscript (md, docx, or world seed)
- --world (ties to Arcanea lore)
- --style-guide (optional)

## Outputs
- Formatted files
- Visual assets
- SIS project entry with full history
- Task contracts for next lanes

## Integration
- Uses SIS for memory.
- Calls sub-agents via Hermes delegation.
- Extracts new editing/visual skills after run.

Self-improves after each book.