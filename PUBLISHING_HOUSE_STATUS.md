# Arcanea Publishing House — verified status

Updated 13 November 2026. **PR_READY; BLOCKED_FOR_COMMERCIAL_LAUNCH.**

Primary ticket: [#3](https://github.com/frankxai/arcanea-publishing-house/issues/3).
Implementation: draft [PR #5](https://github.com/frankxai/arcanea-publishing-house/pull/5), stacked on draft #4.

| Capability | Verified state |
| --- | --- |
| Production runner | Nine executable capability handlers, durable SQLite project/run state, D1 evidence sync, idempotency and optimistic revision checks. |
| Canon Intelligence | Read-only pinned source hash verification and relevant Guardian passage retrieval. Canon is never modified. |
| Manuscript Studio | Existing source preserved. Editorial findings and revision proposals prepared. Optional model adapter has not made a real call. |
| Art / edition | Typographic cover concept, metadata, provenance, EPUB and 23-page PDF review edition. No final cover approval. |
| Editorial / rights | Human review required. Canonical licensing records identify Frank Riemer and historical CC0 exposure; no edition clearance or originality certification asserted. |
| Commerce | Sandbox-only Checkout and verified webhooks, idempotent D1 entitlements, private R2 files, expiring links, refund/dispute revocation. |
| Transaction proof | Stripe API fixture transaction passes. Remote exact-file delivery and revocation verified using a temporary labeled entitlement, then cleaned up. No genuine Stripe sandbox purchase yet. |
| Collector | Canonical registry, provenance schema and unsigned Base/Ethereum preparation. No limited edition released, token minted or auction activity. |
| Distribution | Draft copy and attribution parameter only. No public posts, sends, ads, social profiles or marketing integrations verified. |
| Analyst | Actual revenue €0; observed conversion, retention, fees and margins unknown. Deterministic checks used no paid model calls. |
| UI | Responsive storefront, operations dashboard and browser receipt; nine actual remote screenshots and zero automated WCAG A/AA violations/overflow at 375/768/1440. |
| Hosting | Cloudflare version preview only. Production deployment list empty; R2 public access disabled. Existing Arcanea app billing unchanged. |

## Evidence and access

- https://review-arcanea-publishing-preview.frankxai.workers.dev
- https://review-arcanea-publishing-preview.frankxai.workers.dev/ops
- `evidence/test-results.txt`: 25 Node + 12 Python tests pass.
- `evidence/epubcheck.json`: EPUBCheck 5.4.0, no errors/warnings.
- `evidence/npm-audit.json`: no reported dependency vulnerabilities.
- `evidence/remote-fulfillment.json`: private R2 delivery and revocation, explicitly not a payment.
- `docs/IMPLEMENTATION-INVENTORY-20261113.md`: inspected repositories, deployments, manuscripts and rights.
- `docs/PUBLISHING-RUNBOOK.md`: costs, configuration, trusted approval records and launch gates.

## Blocking decisions and work

Stripe test account/key and signed endpoint; genuine sandbox purchase/refund
proof; literary revisions; edition rights/contributor/history review; final
price/license/refund-support/tax decisions; tagged-PDF/manual reader review;
transactional receipt delivery and cross-device recovery. Cold-load performance
requires direct-network confirmation; proxy lab timings are recorded, not
presented as a production performance pass.

No merge, production deployment, live charge, public launch, external send,
minting or auction is authorized by this draft implementation.
