# Verified publishing implementation inventory

Inspection date: 13 November 2026. Primary ticket: [#3](https://github.com/frankxai/arcanea-publishing-house/issues/3).

| Surface | Verified baseline | Result |
| --- | --- | --- |
| Publishing House | main `f8dc306b408f9dd780b490ea08dc0e7aba98c618`; Hermes profile, nine publishing/social skills and SunEditor/SunDistributor/SunVoice personas. No manuscripts, runnable storefront or payment backend in main. | Extend this repository. |
| Existing release checks | Draft [PR #4](https://github.com/frankxai/arcanea-publishing-house/pull/4), branch `agent/edition-release-gate-20261113`, head `bde66b261b3a3de129454522551919b9ed852817`. | Commerce branch starts here; preserve and test its stdlib gate. |
| Canon and books | `Arcanea-Labs/Arcanea@afc2f17d46bd2659e296edc8b4a2dc4acc0b5cfe`; `book/` has substantial existing manuscripts. | Pin exact source, no canon rewrites. |
| First candidate | Letters to the Seeker: 3,742 words, nine letters, complete existing sequence. Parables: 2,297 words; Rituals: 3,601 words. | Letters offers a coherent bounded reading product. This is an editorial selection, not proof of commercial demand or rights clearance. |
| Rights | Canonical LICENSE/LICENSING.md name Frank Riemer; books/canon all rights reserved; historical CC0 exposure explicitly recorded. Publishing House main has no root license. | Preserve notices; require edition-specific review, contributor evidence and historical grant check. No exclusivity claims. |
| Existing product app | `Arcanea-Labs/arcanea-ai-app@5dab6d11f33e99085af18e0325aff216cd670d08`. Shop checkout uses approved Polar URLs. Legacy Stripe subscription routes have an explicit disabled gate. | Do not alter production billing. Document sandbox Stripe exception. |
| Existing design | App `packages/design-system/src/tokens.css`, TASTE.md and DESIGN.md inspected. | Reuse void/teal/gold/paper palette, Geist hierarchy and restraint. Self-host Geist with OFL evidence. |
| Existing orchestration | `Arcanea-Labs/arcanea-orchestrator`: model/CLI dispatcher with worktree-isolated sessions. Publishing House already specifies Hermes handoffs. | Add a callable production runner; do not replace either runtime. |
| Existing chain work | `Arcanea-Labs/arcanea-onchain`: research/architecture and planned SDK; no verified operational mint path. | Registry + unsigned Base/Ethereum preparation only. |
| Vercel | `arcanea-ai-app`, `arcanea-academy`, `arcanea-domain-portals` exist. App latest returned deployment `arcanea-ai-bs5mcc3uf-starlight-intelligence.vercel.app`, READY, preview target. Environment inventory tool returned CLI fallback/error; secrets not inspected. | No production deployment changed. |
| Stripe connections | Both connections expose only `acct_1RTwWdGTOoTIkR6M`, `frankx.ai`, `livemode:true`. | No test-mode credentials available; no genuine Stripe test transaction can be claimed. |
| Cloudflare baseline | Existing `arcanea-canon`, `arcanea-reader`, `arcanea-creature-atlas`; no publishing bucket/database. | Dedicated preview D1 + private R2 created. New Worker created without deployment; only a version preview uploaded. |

## New executable slice

- Version preview: https://review-arcanea-publishing-preview.frankxai.workers.dev
- Production desk: https://review-arcanea-publishing-preview.frankxai.workers.dev/ops
- Preview D1: `arcanea-publishing-preview`, EU jurisdiction, ID `64e42c60-c242-4214-9220-0cd58ae395db`.
- Preview R2: `arcanea-publishing-preview-private`; private artifacts total 50,097 bytes.
- No production Worker deployments or custom domains. workers.dev production route disabled.
- Secrets exist only as Worker secret bindings. No Stripe key or webhook secret was installed.
- Local provider-fixture transaction tests and remote R2 fulfillment tests are separately labeled in `evidence/`.
