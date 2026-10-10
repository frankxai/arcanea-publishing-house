# Arcanea Publishing House

A local-first publishing profile and capability pack for turning manuscripts, knowledge and original worlds into reviewed books, workbooks, audio packets and distribution-ready editions.

## Honest current state

This repository is a capability scaffold. It contains publishing, campaign, outreach and social skills plus example agent personas. Optional MCP, social, ad, email, creative and distribution integrations are not assumed installed or authorized. A generated artifact is not a published book, sent campaign or completed platform action.

## Product family

See PRODUCTS.md for AuthorOS Starter, Living Guide Forge, World Bible, Learner & Teacher, Audiobook/Trailer and team-studio editions. Each release uses product.manifest.yaml plus the rights, format, distribution and evidence gates in docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md.

## Workflow

Manuscript or source brief → structural edit → source/canon review → line edit → design and media → PDF/EPUB/print/audio validation → rights review → release candidate → authorized submission → listing verification → outcomes and maintenance.

Agents may prepare and validate reversible artifacts. Human approval is required for account agreements, ISBN decisions, public prices, platform submissions, ads and spend, outreach, social publication, partner claims and rights declarations.

## Install and verify

Review distribution.yaml, mcp.json and every requested permission before installing as a Hermes profile. Configure credentials only through local/provider-approved secret storage; never commit them. The pack requires Hermes 0.16 or later, but each connector must be installed and verified separately.

Before a release, validate YAML and local links, run the relevant skill checks, inspect every exported file, bind evidence to the edition checksum and record the actual completion state.

## Architecture

ARCHITECTURE.md describes the intended producer lanes. AGENTS.md and docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md define what may be claimed and which actions remain human-gated.

<!-- STARLIGHT:OPERATING:BEGIN v2 sha=9f8fecc91edc source=794db1e51a55a128816f7aa266eb0ac1dbd452c3 -->

## Agent operating guidance

Repository agents use the shared Starlight operating contract in `AGENTS.md` alongside local instructions.
The contract asks agents to establish a useful outcome, select relevant skills, complete authorized work,
verify current sources, refine the actual artifact, and report evidence and remaining gates.
It covers human agency, privacy, rights, resource stewardship and bounded proactivity.
Repository identity, brand, canon, build commands and release gates remain local.

[Pinned contract](https://github.com/frankxai/Starlight-Intelligence-System/blob/794db1e51a55a128816f7aa266eb0ac1dbd452c3/docs/architecture/agents-md/band-a.md)
· [Projection and verification](https://github.com/frankxai/Starlight-Intelligence-System/blob/794db1e51a55a128816f7aa266eb0ac1dbd452c3/docs/architecture/AGENTS-MD-CONTRACT.md)

These files supply operating guidance. They do not activate an agent, grant tool permissions,
schedule recurring work, certify compliance or prove a live capability.

<!-- STARLIGHT:OPERATING:END -->
