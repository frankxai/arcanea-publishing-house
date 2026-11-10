#!/usr/bin/env bash
set -euo pipefail

# Example: Full Publishing House Workflow for a book
# Run inside or after installing the publishing-house profile.

BOOK_TITLE="${1:-The Marked}"
MANUSCRIPT="${2:-./manuscripts/the-marked.md}"
BUDGET="${3:-1200}"

echo "=== Arcanea Publishing House - Full Launch Workflow ==="
echo "Book: $BOOK_TITLE"
echo "Manuscript: $MANUSCRIPT"
echo "Budget: $BUDGET"
echo

echo "1. Ingest & Produce Book"
hermes -p publishing-house skill run book-production-pipeline \
  --manuscript "$MANUSCRIPT" \
  --world "$BOOK_TITLE" \
  --output ./published/"$BOOK_TITLE"

echo "2. Distribute"
hermes -p publishing-house skill run book-distributor \
  --book "$BOOK_TITLE" \
  --platforms "kdp,ingram,gumroad"

echo "3. Launch Marketing Swarm"
hermes -p publishing-house skill run campaign-launcher \
  --book "$BOOK_TITLE" \
  --budget "$BUDGET" \
  --channels "ads,influencer,social"

echo "4. Activate Social Swarm (Sun Agents with profiles)"
hermes -p publishing-house skill run swarm-social-poster \
  --agent SunVoice \
  --schedule "launch-week"

hermes -p publishing-house skill run social-profile-manager \
  --agent SunVoice \
  --action "verify-profiles"

echo "5. Swarm Coordination & Monitoring"
hermes -p publishing-house skill run swarm-coordinator \
  --goal "monitor and optimize launch for $BOOK_TITLE"

echo
echo "=== Workflow Complete ==="
echo "Check SIS for project graph, provenance, and performance."
echo "Use 'hermes -p publishing-house chat' for interactive control."
echo "Sun Agents now managing their social profiles autonomously (per rules)."