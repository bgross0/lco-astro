#!/usr/bin/env python3
"""
Advanced HEIC converter that handles Live Photos and depth data
"""

import os
import subprocess
import sys
from pathlib import Path

def setup_venv_and_install():
    """Set up virtual environment and install packages"""
    venv_path = Path("/home/ben/Documents/GitHub/lco-astro/heic_venv")

    if not venv_path.exists():
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", str(venv_path)], check=True)

    # Install packages in venv
    pip_path = venv_path / "bin" / "pip"
    print("Installing required packages...")
    subprocess.run([str(pip_path), "install", "pillow", "pillow-heif", "pyheif"],
                   capture_output=True)

    return venv_path

def convert_with_pyheif(heic_path, output_path):
    """Try converting with pyheif"""
    try:
        import pyheif
        from PIL import Image
        import io

        # Read HEIC file
        heif_file = pyheif.read(heic_path)

        # Convert to PIL Image
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data,
            "raw",
            heif_file.mode,
            heif_file.stride,
        )

        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Save as JPEG
        image.save(output_path, 'JPEG', quality=95)
        return True
    except Exception as e:
        return False

def convert_with_imagemagick_advanced(heic_path, output_path):
    """Try converting with ImageMagick using advanced options"""
    try:
        # Try extracting first image layer only
        result = subprocess.run(
            ["convert", f"{heic_path}[0]", "-quality", "95", output_path],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0 and Path(output_path).exists():
            return True

        # Try with explicit format
        result = subprocess.run(
            ["convert", "heic:" + str(heic_path), "-quality", "95", output_path],
            capture_output=True,
            text=True,
            timeout=30
        )

        return result.returncode == 0 and Path(output_path).exists()
    except:
        return False

def extract_with_exiftool(heic_path, output_path):
    """Try extracting embedded JPEG with exiftool"""
    try:
        # Extract embedded JPEG preview
        result = subprocess.run(
            ["exiftool", "-b", "-JpgFromRaw", str(heic_path)],
            capture_output=True,
            timeout=10
        )

        if result.returncode == 0 and result.stdout:
            with open(output_path, 'wb') as f:
                f.write(result.stdout)
            return True
    except:
        pass
    return False

def main():
    source_dir = Path("/home/ben/Documents/GitHub/lco-astro/lco-photos")
    output_dir = Path("/home/ben/Documents/GitHub/lco-astro/lco-photos-converted")
    output_dir.mkdir(exist_ok=True)

    # Get all HEIC files
    heic_files = list(source_dir.glob("*.HEIC")) + list(source_dir.glob("*.heic"))

    print(f"Found {len(heic_files)} HEIC files")
    print("Attempting multiple conversion methods...\n")

    converted = 0
    methods_used = {"imagemagick": 0, "pyheif": 0, "exiftool": 0}

    for i, heic_file in enumerate(heic_files, 1):
        output_file = output_dir / f"{heic_file.stem}.jpg"

        # Skip if already converted
        if output_file.exists():
            print(f"[{i}/{len(heic_files)}] {heic_file.name} - already converted")
            converted += 1
            continue

        print(f"[{i}/{len(heic_files)}] {heic_file.name}...", end=" ")

        # Try ImageMagick with advanced options
        if convert_with_imagemagick_advanced(heic_file, output_file):
            print("✓ (ImageMagick)")
            converted += 1
            methods_used["imagemagick"] += 1
            continue

        # Try pyheif if available
        try:
            if convert_with_pyheif(str(heic_file), str(output_file)):
                print("✓ (pyheif)")
                converted += 1
                methods_used["pyheif"] += 1
                continue
        except ImportError:
            pass

        # Try exiftool as last resort
        if extract_with_exiftool(heic_file, output_file):
            print("✓ (exiftool)")
            converted += 1
            methods_used["exiftool"] += 1
            continue

        print("✗ (all methods failed)")

    print("\n" + "="*50)
    print(f"Conversion complete!")
    print(f"  Total files: {len(heic_files)}")
    print(f"  Successfully converted: {converted}")
    print(f"  Failed: {len(heic_files) - converted}")
    print(f"\nMethods used:")
    for method, count in methods_used.items():
        if count > 0:
            print(f"  {method}: {count} files")

if __name__ == "__main__":
    # First check if we can import pyheif
    try:
        import pyheif
    except ImportError:
        print("Installing pyheif in user space...")
        subprocess.run([sys.executable, "-m", "pip", "install", "--user", "pyheif", "pillow-heif"],
                      capture_output=True)

    main()