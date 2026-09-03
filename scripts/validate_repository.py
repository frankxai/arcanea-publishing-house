#!/usr/bin/env python3
"""Deterministic repository contract checks for Product Studio releases."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote

import yaml

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.name
errors: list[str] = []

REQUIRED_BY_REPO = {
    "arcanea-publishing-house": [
        "AGENTS.md",
        "ARCHITECTURE.md",
        "PRODUCTS.md",
        "README.md",
        "SOUL.md",
        "distribution.yaml",
        "mcp.json",
        "product.manifest.yaml",
        "docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md",
        "docs/media/media-policy.md",
    ],
    "arcanea-templates": [
        "AGENTS.md",
        "MARKETPLACE.md",
        "README.md",
        "catalog.yaml",
        "docs/media/media-policy.md",
    ],
}

DOCS_TO_CHECK = {
    "arcanea-publishing-house": [
        "AGENTS.md",
        "README.md",
        "PRODUCTS.md",
        "docs/RIGHTS-DISTRIBUTION-AND-MONETIZATION.md",
        "docs/media/media-policy.md",
    ],
    "arcanea-templates": [
        "AGENTS.md",
        "README.md",
        "MARKETPLACE.md",
        "docs/media/media-policy.md",
    ],
}


def record(message: str) -> None:
    errors.append(message)


for relative in REQUIRED_BY_REPO.get(REPO, []):
    if not (ROOT / relative).is_file():
        record(f"missing required file: {relative}")

for path in sorted(ROOT.rglob("*.json")):
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        record(f"invalid JSON {path.relative_to(ROOT)}: {exc}")

yaml_paths = sorted({*ROOT.rglob("*.yaml"), *ROOT.rglob("*.yml")})
for path in yaml_paths:
    try:
        yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception as exc:
        record(f"invalid YAML {path.relative_to(ROOT)}: {exc}")

manifest_path = ROOT / "product.manifest.yaml"
if manifest_path.is_file():
    manifest = yaml.safe_load(manifest_path.read_text(encoding="utf-8")) or {}
    for key in (
        "schema_version",
        "product_id",
        "sku_id",
        "name",
        "brand_id",
        "repository",
        "status",
        "format",
        "buyer",
        "promise",
        "activation_event",
        "commercial",
        "rights",
        "channels",
        "maintenance",
        "stop_rule",
    ):
        if key not in manifest:
            record(f"product.manifest.yaml missing key: {key}")
    expected_repo = f"frankxai/{REPO}"
    if manifest.get("repository") != expected_repo:
        record(
            "product.manifest.yaml repository mismatch: "
            f"{manifest.get('repository')!r} != {expected_repo!r}"
        )
    if manifest.get("brand_id") in (None, "", "pending", "decision_required"):
        record("product.manifest.yaml must use a canonical brand_id")

catalog_path = ROOT / "catalog.yaml"
if catalog_path.is_file():
    catalog = yaml.safe_load(catalog_path.read_text(encoding="utf-8")) or {}
    items = catalog.get("items")
    if not isinstance(items, list) or not items:
        record("catalog.yaml items must be a non-empty list")
    else:
        seen_ids: set[str] = set()
        seen_repositories: set[str] = set()
        for index, item in enumerate(items):
            if not isinstance(item, dict):
                record(f"catalog item {index} must be a mapping")
                continue
            for key in ("id", "repository", "github_state", "release_state"):
                if not item.get(key):
                    record(f"catalog item {index} missing {key}")
            item_id = item.get("id")
            repository = item.get("repository")
            if item_id in seen_ids:
                record(f"duplicate catalog id: {item_id}")
            if repository in seen_repositories:
                record(f"duplicate catalog repository: {repository}")
            seen_ids.add(item_id)
            seen_repositories.add(repository)
            if item.get("github_state") == "archived" and not str(
                item.get("release_state", "")
            ).startswith("retired"):
                record(f"archived catalog item must be retired: {item_id}")

link_pattern = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
for relative in DOCS_TO_CHECK.get(REPO, []):
    doc = ROOT / relative
    if not doc.is_file():
        continue
    for raw_target in link_pattern.findall(doc.read_text(encoding="utf-8")):
        target = raw_target.strip().split(maxsplit=1)[0].strip("<>")
        if target.startswith(("#", "http://", "https://", "mailto:")):
            continue
        clean = unquote(target.split("#", 1)[0])
        resolved = (doc.parent / clean).resolve()
        try:
            resolved.relative_to(ROOT.resolve())
        except ValueError:
            record(f"local link escapes repository in {relative}: {raw_target}")
            continue
        if not resolved.exists():
            record(f"broken local link in {relative}: {raw_target}")

if errors:
    print("Repository contract validation failed:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(
    f"Validated {REPO}: {len(yaml_paths)} YAML files, "
    f"{len(list(ROOT.rglob('*.json')))} JSON files, required contracts and local links."
)
