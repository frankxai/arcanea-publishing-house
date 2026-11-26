# Edition Release Gate — additive Hermes capability

This implementation extends the existing Publishing House; it does not replace SunEditor, ProductionLuminor, SunDistributor or Hermes orchestration.

## Usage

Create a JSON manifest next to a real manuscript. Run:

```bash
python3 tools/edition_release_gate.py path/to/edition.json --out path/to/release-evidence.json
python3 -m unittest discover -s tests -p 'test_edition_release_gate.py'
```

Manifest fields: `edition_id`, `title`, `manuscript` (relative to manifest), `rights_owner`, `rights_approved`, `editorial_approved`, `release_approved`, `price_eur`, `currency: EUR`, `edition_type: digital|collector|one-of-one`, and `max_supply` for collector types.

Only an explicitly approved, nonempty manuscript can become STAGED. The gate emits content checksums for provenance. It does **not** publish, charge customers, verify legal ownership, or certify literary quality. Approval flags are declarations from an authorized reviewer, not evidence by themselves. Wire identity-backed approvals and signed records before production.

## Next integration contracts

- Hermes orchestrator runs the gate after SunEditor, ProductionLuminor and rights review.
- Immutable edition ID maps to Stripe SKU, private R2 artifact, download entitlement and optional chain token.
- Stripe TEST checkout: signed webhook, idempotent payment fulfillment, secure expiring download links, refund revocation, negative-path tests.
- Collector adapter: no mint/listing until provenance, rights and human approval.
- Log real production cost and contribution margin; never invent sales or auction bids.

See issue #3 for the complete implementation mission.
