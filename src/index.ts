#!/usr/bin/env node

import { createRequire } from "node:module";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { RecraftClient } from "./recraft-client.js";
import { createServer, parseToolsets } from "./server.js";
import { checkForUpdate } from "./update-checker.js";

const require = createRequire(import.meta.url);
const { name, version } = require("../package.json") as { name: string; version: string };

const apiToken = process.env.RECRAFT_API_TOKEN;

if (!apiToken) {
  console.error("Missing required env var: RECRAFT_API_TOKEN");
  process.exit(1);
}

const cacheTtl = process.env.RECRAFT_CACHE_TTL !== undefined
  ? parseInt(process.env.RECRAFT_CACHE_TTL, 10) * 1000
  : undefined;
const maxRetries = process.env.RECRAFT_MAX_RETRIES !== undefined
  ? parseInt(process.env.RECRAFT_MAX_RETRIES, 10)
  : 3;
const client = new RecraftClient(apiToken, undefined, cacheTtl, { maxRetries });
const toolsets = parseToolsets(process.env.RECRAFT_TOOLSETS);

// serveStdio serves 2026-07-28 clients and clients that open with the 2025 handshake.
serveStdio(() => createServer(client, toolsets), {
  onerror: (error) => console.error("Recraft MCP server error:", error),
});

// Do not wait for the update check: the server must start at once.
void checkForUpdate(name, version);
