#!/usr/bin/env python3

import os
import subprocess
from pathlib import Path

source_dir = Path("/home/ben/Documents/GitHub/lco-astro/lco-photos")
output_dir = Path("/home/ben/Documents/GitHub/lco-astro/lco-photos-converted")

# Create output directory
output_dir.mkdir(exist_ok=True)

# Get all HEIC files (both uppercase and lowercase)
heic_files = list(source_dir.glob("*.HEIC")) + list(source_dir.glob("*.heic"))

print(f"Found {len(heic_files)} HEIC files to convert\n")

converted = 0
failed = 0

for i, heic_file in enumerate(heic_files, 1):
    # Output filename (JPG)
    output_file = output_dir / f"{heic_file.stem}.jpg"

    # Skip if already converted
    if output_file.exists():
        print(f"[{i}/{len(heic_files)}] Skipping {heic_file.name} - already converted")
        converted += 1
        continue

    print(f"[{i}/{len(heic_files)}] Converting {heic_file.name}...", end=" ")

    # Use ImageMagick convert command
    try:
        result = subprocess.run(
            ["convert", str(heic_file), "-quality", "95", str(output_file)],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0 and output_file.exists():
            size_mb = output_file.stat().st_size / (1024 * 1024)
            print(f"✓ ({size_mb:.1f} MB)")
            converted += 1
        else:
            print(f"✗ Error: {result.stderr[:100] if result.stderr else 'Unknown error'}")
            failed += 1
    except subprocess.TimeoutExpired:
        print("✗ Timeout")
        failed += 1
    except Exception as e:
        print(f"✗ Exception: {e}")
        failed += 1

print("\n" + "="*50)
print(f"Conversion complete!")
print(f"  Successfully converted: {converted}")
print(f"  Failed: {failed}")
print(f"  Output directory: {output_dir}")

# List some of the converted files
if converted > 0:
    print("\nSample converted files:")
    for jpg_file in sorted(output_dir.glob("*.jpg"))[:5]:
        size_mb = jpg_file.stat().st_size / (1024 * 1024)
        print(f"  {jpg_file.name}: {size_mb:.1f} MB")