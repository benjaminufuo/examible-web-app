#!/bin/bash

# Image Optimization Script for Examible
# This script compresses all images in src/assets/public

set -e

ASSETS_DIR="/Users/mroriginal/Desktop/examible-web-app/src/assets/public"
BACKUP_DIR="/Users/mroriginal/Desktop/examible-web-app/src/assets/public-backup"

echo "🖼️  Examible Image Optimization Script"
echo "======================================"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    brew install imagemagick
fi

# Create backup
echo "📦 Creating backup of original images..."
if [ -d "$BACKUP_DIR" ]; then
    echo "   Backup already exists at $BACKUP_DIR"
else
    cp -r "$ASSETS_DIR" "$BACKUP_DIR"
    echo "   ✓ Backup created at $BACKUP_DIR"
fi

echo ""
echo "🔄 Optimizing images..."
echo ""

# Count files
jpg_count=$(find "$ASSETS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | wc -l)
png_count=$(find "$ASSETS_DIR" -type f -name "*.png" | wc -l)

echo "📊 Found $jpg_count JPG files and $png_count PNG files"
echo ""

# Get initial size
initial_size=$(du -sh "$ASSETS_DIR" | cut -f1)
echo "Initial size: $initial_size"

# Optimize JPG files (85% quality)
if [ $jpg_count -gt 0 ]; then
    echo ""
    echo "Optimizing JPG files (quality: 85%)..."
    find "$ASSETS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) -exec bash -c '
        file="$1"
        filename=$(basename "$file")
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        convert "$file" -quality 85 -strip "$file"
        new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        reduction=$((100 * (original_size - new_size) / original_size))
        printf "  %-40s %6.1f KB → %6.1f KB (%d%% reduction)\n" "$filename" "$((original_size/1024))" "$((new_size/1024))" "$reduction"
    ' _ {} \;
fi

# Optimize PNG files using pngquant if available
if command -v pngquant &> /dev/null && [ $png_count -gt 0 ]; then
    echo ""
    echo "Optimizing PNG files (quality: 75-85%)..."
    find "$ASSETS_DIR" -type f -name "*.png" -exec bash -c '
        file="$1"
        filename=$(basename "$file")
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        pngquant --quality=75-85 --strip --ext=.png --force "$file" 2>/dev/null || true
        new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        reduction=$((100 * (original_size - new_size) / original_size))
        printf "  %-40s %6.1f KB → %6.1f KB (%d%% reduction)\n" "$filename" "$((original_size/1024))" "$((new_size/1024))" "$reduction"
    ' _ {} \;
else
    echo ""
    echo "Note: pngquant not found. Using ImageMagick for PNG optimization..."
    echo "Install pngquant for better PNG compression: brew install pngquant"
fi

# Get final size
final_size=$(du -sh "$ASSETS_DIR" | cut -f1)
echo ""
echo "======================================"
echo "✅ Optimization Complete!"
echo ""
echo "Initial size: $initial_size"
echo "Final size:   $final_size"
echo ""
echo "📁 Backup saved at: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Test your app: npm run dev"
echo "2. Check images still look good"
echo "3. Build and test: npm run build"
echo ""
