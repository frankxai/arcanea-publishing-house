# Example: Full Publishing House Workflow for a book (Windows PowerShell)
# Run after installing the publishing-house profile.

param(
    [string]$BookTitle = "The Marked",
    [string]$Manuscript = ".\manuscripts\the-marked.md",
    [int]$Budget = 1200
)

Write-Host "=== Arcanea Publishing House - Full Launch Workflow (Windows) ==="
Write-Host "Book: $BookTitle"
Write-Host "Manuscript: $Manuscript"
Write-Host "Budget: $Budget"
Write-Host ""

Write-Host "1. Ingest & Produce Book"
hermes -p publishing-house skill run book-production-pipeline `
  --manuscript $Manuscript `
  --world $BookTitle `
  --output ".\published\$BookTitle"

Write-Host "2. Distribute"
hermes -p publishing-house skill run book-distributor `
  --book $BookTitle `
  --platforms "kdp,ingram,gumroad"

Write-Host "3. Launch Marketing Swarm"
hermes -p publishing-house skill run campaign-launcher `
  --book $BookTitle `
  --budget $Budget `
  --channels "ads,influencer,social"

Write-Host "4. Activate Social Swarm (Sun Agents with profiles)"
hermes -p publishing-house skill run swarm-social-poster `
  --agent SunVoice `
  --schedule "launch-week"

hermes -p publishing-house skill run social-profile-manager `
  --agent SunVoice `
  --action "verify-profiles"

Write-Host "5. Swarm Coordination & Monitoring"
hermes -p publishing-house skill run swarm-coordinator `
  --goal "monitor and optimize launch for $BookTitle"

Write-Host ""
Write-Host "=== Workflow Complete ==="
Write-Host "Check SIS for project graph, provenance, and performance."
Write-Host "Use 'hermes -p publishing-house chat' for interactive control."
Write-Host "Sun Agents now managing their social profiles autonomously (per rules)."