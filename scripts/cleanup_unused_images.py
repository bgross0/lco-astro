#!/usr/bin/env python3
"""
Identify image files under public/images that are not referenced in the codebase
and optionally move them into an _archive_unused folder for manual review.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
from pathlib import Path
from typing import Iterable, Set

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = REPO_ROOT / "public"
IMAGES_ROOT = PUBLIC_DIR / "images"
ARCHIVE_ROOT = IMAGES_ROOT / "_archive_unused"

# Search pattern for image references in project files.
RG_PATTERN = r"/images/[A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|svg)"
# File globs we scan for references.
RG_GLOB = "*.{astro,ts,tsx,js,jsx,md,mdx,json,html,yaml,yml,css,scss,svelte}"


def gather_referenced_images() -> Set[Path]:
    """Use ripgrep to collect referenced image paths."""
    try:
        result = subprocess.run(
            [
                "rg",
                "--only-matching",
                "--no-filename",
                "--glob",
                RG_GLOB,
                RG_PATTERN,
                ".",
            ],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        raise SystemExit(
            "ripgrep command failed while scanning for image references"
        ) from exc

    refs: Set[Path] = set()
    for raw in result.stdout.splitlines():
        ref = raw.strip()
        if not ref:
            continue
        # Normalise leading characters and convert to a path relative to public/.
        if ref.startswith("//"):
            ref = ref[1:]
        if ref.startswith("./"):
            ref = ref[1:]
        if not ref.startswith("/"):
            ref = "/" + ref.lstrip("/")
        # Convert /images/foo.jpg -> public/images/foo.jpg
        resolved = (PUBLIC_DIR / ref.lstrip("/")).resolve()
        if resolved.is_relative_to(PUBLIC_DIR):
            refs.add(resolved)
    return refs


def gather_actual_images() -> Set[Path]:
    """Return the set of actual image files currently in public/images."""
    files: Set[Path] = set()
    for file in IMAGES_ROOT.rglob("*"):
        if not file.is_file():
            continue
        try:
            rel_parts = file.relative_to(IMAGES_ROOT).parts
        except ValueError:
            continue
        if "_archive_unused" in rel_parts:
            # Skip anything already archived.
            continue
        files.add(file.resolve())
    return files


def move_unused(unused: Iterable[Path], dry_run: bool, verbose: bool) -> None:
    """Move unused images into the archive folder."""
    count = 0
    for file in unused:
        target = ARCHIVE_ROOT / file.relative_to(IMAGES_ROOT)
        if verbose or dry_run:
            action = "Would move" if dry_run else "Moving"
            print(f"{action}: {file.relative_to(REPO_ROOT)} -> {target.relative_to(REPO_ROOT)}")
        if dry_run:
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(file), str(target))
        count += 1
    if not dry_run:
        print(f"Moved {count} files into {ARCHIVE_ROOT.relative_to(REPO_ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show which files would be moved without changing anything.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print each file being moved in addition to the summary.",
    )
    args = parser.parse_args()

    if not IMAGES_ROOT.exists():
        raise SystemExit("public/images directory not found.")

    referenced = gather_referenced_images()
    actual = gather_actual_images()
    unused = sorted(actual - referenced)

    print(f"Total images found: {len(actual)}")
    print(f"Referenced images: {len(actual & referenced)}")
    print(f"Unused images: {len(unused)}")
    if args.dry_run:
        print("Dry run mode: no files will be moved.")

    move_unused(unused, dry_run=args.dry_run, verbose=args.verbose)


if __name__ == "__main__":
    main()

