#!/usr/bin/env python3
"""
Convert HEIC files to JPG using pillow-heif
Install with: pip install pillow-heif Pillow
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    from pillow_heif import register_heif_opener
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "pillow-heif", "Pillow"])
    from PIL import Image
    from pillow_heif import register_heif_opener

# Register HEIF opener with PIL
register_heif_opener()

def convert_heic_to_jpg(input_path, output_path, quality=95):
    """Convert HEIC file to JPG"""
    try:
        # Open HEIC file
        image = Image.open(input_path)

        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Save as JPG
        image.save(output_path, 'JPEG', quality=quality, optimize=True)
        return True
    except Exception as e:
        print(f"Error converting {input_path}: {e}")
        return False

def process_directory(source_dir, output_dir):
    """Process all HEIC files in a directory"""
    source_path = Path(source_dir)
    output_path = Path(output_dir)

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    # Find all HEIC files
    heic_files = list(source_path.glob('*.HEIC')) + list(source_path.glob('*.heic'))

    print(f"Found {len(heic_files)} HEIC files to convert")

    converted = 0
    for heic_file in heic_files:
        # Create output filename
        jpg_filename = heic_file.stem + '.jpg'
        output_file = output_path / jpg_filename

        print(f"Converting {heic_file.name} -> {jpg_filename}")

        if convert_heic_to_jpg(str(heic_file), str(output_file)):
            converted += 1
            print(f"  ✓ Converted successfully")

            # Get file sizes for comparison
            heic_size = heic_file.stat().st_size / (1024 * 1024)  # MB
            jpg_size = output_file.stat().st_size / (1024 * 1024)  # MB

            # Get image dimensions
            with Image.open(output_file) as img:
                width, height = img.size
                print(f"  Dimensions: {width}x{height}")
                print(f"  File size: {heic_size:.1f}MB -> {jpg_size:.1f}MB")
        else:
            print(f"  ✗ Failed to convert")

    print(f"\nConverted {converted}/{len(heic_files)} files")
    return converted

if __name__ == "__main__":
    # Set paths
    source_dir = "/home/ben/Documents/GitHub/lco-astro/lco-photos"
    output_dir = "/home/ben/Documents/GitHub/lco-astro/lco-photos-processed/converted"

    # Run conversion
    process_directory(source_dir, output_dir)