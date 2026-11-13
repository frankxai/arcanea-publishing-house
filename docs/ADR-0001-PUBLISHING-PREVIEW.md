# ADR 0001: isolated Stripe/R2 publishing preview

Accepted scope: issue #3 requests Stripe test Checkout, D1 entitlements and private
Cloudflare R2 delivery inside the existing Publishing House repository.

The deployed Arcanea application uses Polar and its own fail-closed release
catalog. Estate app guidance favors Vercel Blob over R2 for new product storage.
The explicit issue/user requirement selects R2 and Stripe for this preview.
This is a bounded exception, not a replacement estate billing/storage doctrine.

Keep production Arcanea checkout unchanged. The Publishing House owns edition
manifests, production evidence and this isolated test commerce adapter. Its
runner remains callable from the existing Hermes profile and Arcanea
Orchestrator. Canon stays in Arcanea-Labs/Arcanea; imported manuscript bytes are
an immutable source snapshot with source revision and hash.

Do not wire a live Arcanea route until an owner chooses the final commerce rail
and reviews the edition. No second paid checkout, live API key or automatic
production promotion is included. Worker version uploads do not create a
production deployment; version preview resources are isolated from existing apps.
