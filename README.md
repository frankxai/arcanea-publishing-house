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
