#!/usr/bin/env node

/**
 * @fileoverview Main entry point for the Recraft MCP server
 * This file initializes and runs the Model Context Protocol server that provides
 * integration with Recraft tools.
 */

import "dotenv/config";
import { server } from "./server.js";

/* Start the server */
server.start({
  transportType: "stdio",
});

/* Handle process termination */
process.on("SIGINT", () => {
  process.exit(0);
});
