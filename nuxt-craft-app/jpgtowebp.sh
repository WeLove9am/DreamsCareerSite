QUALITY_FACTOR=70
OUTPUT_DIR="webp_optimized"

mkdir -p "$OUTPUT_DIR"

echo "Starting conversion to WebP (Quality: $QUALITY_FACTOR)..."

for file in *.jpg; do
    if [ -f "$file" ]; then
        BASENAME=$(basename "$file" .jpg)
        NEW_NAME="${OUTPUT_DIR}/${BASENAME}.webp"
        
        cwebp -q $QUALITY_FACTOR "$file" -o "$NEW_NAME"
        echo "Converted $file to $NEW_NAME"
    fi
done

echo "Conversion complete. New files are in the '$OUTPUT_DIR' folder."