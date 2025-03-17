#!/bin/bash

# Exit on any error
set -e

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Check if .env file exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "Error: .env file not found in $SCRIPT_DIR"
    exit 1
fi

# Check if dist/index.js exists
if [ ! -f "$SCRIPT_DIR/dist/index.js" ]; then
    echo "Error: dist/index.js not found. Please run 'npm run build' first"
    exit 1
fi

# Load environment variables from .env file
export $(grep -v '^#' $SCRIPT_DIR/.env | xargs)

# Start the MCP server
echo "Starting Recraft MCP server with environment variables from .env file"
node $SCRIPT_DIR/dist/index.js 