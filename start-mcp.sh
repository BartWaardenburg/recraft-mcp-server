#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Load environment variables from .env file
export $(grep -v '^#' $SCRIPT_DIR/.env | xargs)

# Start the MCP server
echo "Starting Recraft MCP server with environment variables from .env file"
node $SCRIPT_DIR/dist/index.js 