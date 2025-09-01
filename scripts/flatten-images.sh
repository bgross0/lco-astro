#!/bin/bash
# This script copies all images from subdirectories to the root images folder
# for Decap CMS media library (which doesn't scan subdirectories)

cd public/images

# Copy all images from subdirectories to root, preserving originals
for dir in equipment landscaping snow-removal; do
  if [ -d "$dir" ]; then
    for file in "$dir"/*.{jpg,png,webp} 2>/dev/null; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        # Prefix with directory name to avoid conflicts
        cp "$file" "${dir}-${filename}"
      fi
    done
  fi
done

echo "Images flattened for media library"