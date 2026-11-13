# Publishing preview operations

## Run and verify

```sh
npm ci --ignore-scripts
npm run check
npm run test:interface
python3 scripts/validate_repository.py
python3 tools/publishing_agent.py
```

The production runner executes nine capability handlers and preserves idempotent
SQLite run/project records under `.state/`. Pass `--canon <path>` with the pinned canonical file from `canon/source.json` to retrieve source passages and compare Guardian names; a hash mismatch fails closed and missing canon stays blocked. It emits `arcanea.task.v1` evidence,
input/output hashes, model version and known/unknown cost. It returns review or
blocked states honestly. Its optional HTTPS model adapter writes revision
proposals only; no paid model call has been executed in this release.

Configure `ARCANEA_MODEL_URL`, `ARCANEA_MODEL` and `ARCANEA_API_KEY` only in the
owner runtime secret store to run Manuscript Studio with `--creative`. Set
`ARCANEA_OPS_TOKEN` in that same runtime and add `--sync-url <preview-origin>` to
sync verified run digests to D1. The same command is callable by Hermes or Arcanea
Orchestrator. An installed scheduler or connected model runtime is not claimed.

Rebuild from the preserved snapshot with `python3 tools/build_edition.py`.
Dependencies for the format builder: Python ReportLab. EPUBCheck 5.4.0 validated
the supplied EPUB with zero errors/warnings. The PDF is selectable, 23 pages,
and contains bookmarks, but it is untagged and is not PDF/UA-certified.

## Test-mode activation

1. Connect an actual Stripe sandbox/test account. Both currently connected links
   expose live mode only. Never repurpose those keys or switch their mode flag.
2. Add only `sk_test_`/`rk_test_` key and endpoint `whsec_` through the preview
   Worker secret store. This build rejects live keys and live webhook events.
3. Register `/api/stripe/webhook` for `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`, `charge.refunded` and
   `charge.dispute.created` in the sandbox. Configure Stripe's test receipt
   settings explicitly; email receipt delivery has not been verified.
4. The owner reviews exact manifest SHA and records rights/editorial/price/sandbox
   approvals in the operator-controlled D1 table. Each approval needs an actor,
   timestamp, expiry and exact manifest digest. There is no public or agent
   approval-writing endpoint. An approval flag in a client JSON file is not
   authority. Revised bytes require fresh approvals.
5. Upload a new **version** with preview-safe bindings. Keep production
   `workers_dev:false`, `preview_urls:true`, no production deployment or domains.
6. Complete Checkout with Stripe's test card, inspect the signed event and D1
   state, download both exact artifacts, issue a sandbox refund, verify old
   links fail and attach Stripe object/event IDs and receipts to #3.

The UI return URL never creates access. The webhook authenticates raw bytes,
checks the timestamp and test-mode event, then retrieves the Checkout Session
from Stripe and validates amount, currency, session/order/edition/manifest and
payment intent. D1 batches record the event and entitlement atomically. Refund
and dispute tombstones survive out-of-order paid events. Partial refunds revoke
this single-book entitlement conservatively.

The browser stores only a 256-bit bearer secret in an HttpOnly/Secure/SameSite
cookie; D1 stores its hash. Five-minute HMAC download URLs recheck order status
and exact R2 artifact integrity at every request. Query logging is disabled in
the preview. Operator routes require a separate secret. No PII is exposed by
public production/readiness endpoints.

## Verified boundaries and remaining launch gates

- A fixture is not a Stripe test purchase. Remote fulfillment evidence injects a
  clearly labeled test entitlement, downloads real private R2 bytes, revokes it,
  then removes the fixture. Remote order count is zero after cleanup.
- Existing book source is preserved; targeted literary revision proposals are
  in `editions/letters-to-the-seeker/EDITORIAL-REVIEW.md`. Canon decisions,
  historical licensing exposure, originality comparison and contributor/AI
  attribution still need human review.
- PDF tagging and independent reading-system/manual accessibility testing remain.
- A browser receipt is implemented. Cross-device account recovery and verified
  transactional email delivery remain launch blockers for a public paid product.
- €9 is a test-price proposal. Tax/invoicing, final reader license, refund/support
  policy and the production commerce rail need owner decisions before launch.
- Collector records are proposals; digital supply is uncapped. Base/Ethereum
  adapters produce unsigned data, never transactions, minting or auction activity.
- PRs remain draft. Merge, production deployment, live payments, publication,
  token minting and auctions require separate explicit owner approval.

## Cost evidence

No model calls, live charges, ads, minting or auction transactions were performed.
Known deterministic model cost is €0; provider/model creative cost is unknown
until a real run returns usage and its invoice is reconciled. Paid conversion,
contribution margin and retention are unknown because there are no real buyers
or instrumented visits; the dashboard shows unknown values.

Two stored book files total 50,097 bytes. At published R2 Standard storage rates
($0.015/GB-month), that payload alone is less than $0.000001/month before account
allowances, operation billing and billing rounding. Account-wide Workers/D1
usage and any existing plan fee are not attributable from this test; no new paid
plan was subscribed. Startup credit eligibility/balance was not independently
verified. Stripe fees/tax are unmodeled until the chosen account, rail and market
are confirmed.

Pricing references inspected this session:
https://developers.cloudflare.com/workers/platform/pricing/
https://developers.cloudflare.com/r2/pricing/
https://developers.cloudflare.com/d1/platform/pricing/
