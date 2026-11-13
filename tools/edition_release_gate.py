#!/usr/bin/env python3
"""Arcanea release candidate gate. Stdlib only; no external side effects."""
import argparse
import hashlib
import json
import pathlib
import re
import sys

STATES = ("IDEA", "BRIEF", "DRAFT", "EDITORIAL_QA", "ART", "RIGHTS_QA", "PREVIEW", "HUMAN_APPROVAL", "STAGED", "RELEASED", "MEASURED")
REQUIRED = ("edition_id", "title", "manuscript", "rights_owner", "rights_approved", "editorial_approved", "release_approved", "price_eur", "currency", "edition_type")

def validate(root, manifest):
    errors = []
    for key in REQUIRED:
        if key not in manifest:
            errors.append("missing: " + key)
    edition_id = str(manifest.get("edition_id", ""))
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{2,79}", edition_id):
        errors.append("edition_id must be a lowercase slug of 3-80 characters")
    source = pathlib.Path(str(manifest.get("manuscript", "")))
    if source.is_absolute() or ".." in source.parts or not source.parts:
        errors.append("manuscript path must be relative and inside the workspace")
    else:
        path = (root / source).resolve()
        if not path.is_relative_to(root.resolve()) or not path.is_file():
            errors.append("manuscript not found")
        elif not path.read_text(encoding="utf-8").strip():
            errors.append("manuscript is empty")
    for key in ("rights_approved", "editorial_approved", "release_approved"):
        if manifest.get(key) is not True:
            errors.append(key + " must be explicitly true")
    if not str(manifest.get("rights_owner", "")).strip():
        errors.append("rights_owner is required")
    if type(manifest.get("price_eur")) not in (int, float) or manifest.get("price_eur", -1) < 0:
        errors.append("price_eur must be nonnegative number")
    if manifest.get("currency") != "EUR":
        errors.append("currency must be EUR")
    if manifest.get("edition_type") not in ("digital", "collector", "one-of-one"):
        errors.append("unsupported edition_type")
    if manifest.get("edition_type") != "digital":
        supply = manifest.get("max_supply")
        if type(supply) is not int or supply < 1:
            errors.append("collector editions require positive integer max_supply")
    return errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=pathlib.Path)
    parser.add_argument("--out", type=pathlib.Path)
    args = parser.parse_args()
    root = args.manifest.resolve().parent
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
        errors = validate(root, manifest)
    except (OSError, ValueError, UnicodeError) as exc:
        print(json.dumps({"passed": False, "errors": [str(exc)]}, indent=2))
        return 1
    result = {"passed": not errors, "errors": errors, "edition_id": manifest.get("edition_id"), "state": "STAGED" if not errors else "BLOCKED"}
    if not errors:
        manuscript = root / manifest["manuscript"]
        result["manuscript_sha256"] = hashlib.sha256(manuscript.read_bytes()).hexdigest()
        result["manifest_sha256"] = hashlib.sha256(args.manifest.read_bytes()).hexdigest()
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0 if not errors else 1

if __name__ == "__main__":
    sys.exit(main())
