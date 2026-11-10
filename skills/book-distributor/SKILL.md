---
name: book-distributor
category: publishing
version: 0.2.0
description: Handle distribution to KDP, IngramSpark, Gumroad, Shopify, and other platforms. Includes metadata, pricing, launch sequencing.
author: Arcanea Publishing House
trust: local
---

# Book Distributor Skill

Automates or assists end-to-end distribution after production.

## Usage
```bash
hermes -p publishing-house skill run book-distributor \
  --book "The Marked" \
  --platforms "kdp,ingram,gumroad" \
  --action "prepare-and-launch"
```

## Implementation Steps (orchestrated)
1. Gather metadata from SIS/project graph + book-production output.
2. Generate platform-specific metadata, descriptions, categories (use lore consistency).
3. Prepare files (ePub, PDF, cover, interiors).
4. For each platform:
   - KDP: ISBN, pricing, territories, keywords (via browser MCP or API if available).
   - IngramSpark: wholesale, POD specs.
   - Gumroad/Shopify: storefront setup, pricing tiers, bundles.
5. Set launch date/sequencing.
6. Create task contracts for Marketing swarm.
7. Log everything to SIS with provenance.

## MCPs Used
- sis_memory
- email_outreach (for platform support tickets if needed)
- browser or ad-hoc for upload UIs

## Outputs
- Platform listings ready
- Launch checklist
- Updated SIS project with distribution records

Self-improving: after launch, track sales data and propose pricing tweaks.