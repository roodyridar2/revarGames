#!/bin/bash

# S3 Bucket name (passed as the first argument)
S3_BUCKET="$1"

# Source folder (passed as the second argument)
SOURCE_FOLDER="$2"

# Ensure required arguments are provided
if [[ -z "$S3_BUCKET" || -z "$SOURCE_FOLDER" ]]; then
    echo "Usage: $0 <S3_BUCKET> <SOURCE_FOLDER>"
    exit 1
fi

# Ensure the source folder exists
if [[ ! -d "$SOURCE_FOLDER" ]]; then
    echo "Error: Source folder '$SOURCE_FOLDER' does not exist."
    exit 1
fi

# Iterate over files in the source folder
find "$SOURCE_FOLDER" -type f | while read -r file; do
    # Determine the content type based on file extension
    case "$file" in
        *.html)
            content_type="text/html"
            ;;
        *.css)
            content_type="text/css"
            ;;
        *.js)
            content_type="application/javascript"
            ;;
        *.wasm)
            content_type="application/wasm"
            ;;
        *.wasm.gz)
            content_type="application/wasm"
            content_encoding="gzip"
            ;;
        *.js.gz)
            content_type="application/javascript"
            content_encoding="gzip"
            ;;
        *.data.gz)
            content_type="application/javascript"
            content_encoding="gzip"
            ;;
        *)
            content_type="binary/octet-stream" # Default for unknown files
            ;;
    esac

    # Remove the source folder prefix from the destination path
    relative_path="${file#$SOURCE_FOLDER/}"

    # Build the aws s3 cp command
    if [[ "$content_encoding" == "gzip" ]]; then
        aws s3 cp "$file" "s3://${S3_BUCKET}/${relative_path}" \
            --content-type "$content_type" \
            --content-encoding "$content_encoding"
    else
        aws s3 cp "$file" "s3://${S3_BUCKET}/${relative_path}" \
            --content-type "$content_type"
    fi

    # Reset content_encoding for the next file
    unset content_encoding
done
