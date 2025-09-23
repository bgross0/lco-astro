#!/bin/bash

# Convert all HEIC files to JPG using ImageMagick

SOURCE_DIR="/home/ben/Documents/GitHub/lco-astro/lco-photos"
OUTPUT_DIR="/home/ben/Documents/GitHub/lco-astro/lco-photos-converted"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter for progress
total=$(find "$SOURCE_DIR" -iname "*.heic" | wc -l)
current=0

echo "Converting $total HEIC files to JPG..."
echo "================================"

# Convert each HEIC file
for heic_file in "$SOURCE_DIR"/*.HEIC "$SOURCE_DIR"/*.heic; do
    # Check if file exists (pattern might not match anything)
    [ -f "$heic_file" ] || continue

    # Get filename without path and extension
    filename=$(basename "$heic_file")
    name="${filename%.*}"

    # Output path
    output_file="$OUTPUT_DIR/${name}.jpg"

    # Increment counter
    ((current++))

    # Show progress
    echo "[$current/$total] Converting: $filename"

    # Convert using ImageMagick
    if magick "$heic_file" -quality 95 "$output_file" 2>/dev/null || convert "$heic_file" -quality 95 "$output_file" 2>/dev/null; then
        echo "  ✓ Success: ${name}.jpg"

        # Get file size info
        original_size=$(du -h "$heic_file" | cut -f1)
        converted_size=$(du -h "$output_file" | cut -f1)
        echo "  Size: $original_size → $converted_size"
    else
        echo "  ✗ Failed to convert $filename"
    fi
done

echo "================================"
echo "Conversion complete!"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Count results
converted=$(ls -1 "$OUTPUT_DIR"/*.jpg 2>/dev/null | wc -l)
echo "Successfully converted: $converted/$total files"