import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RecraftClient } from "./recraft-client.js";
import { registerGenerationTools } from "./tools/generation.js";
import { registerProcessingTools } from "./tools/processing.js";
import { registerStyleTools } from "./tools/styles.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

export type Toolset = "generation" | "processing" | "styles";

const ALL_TOOLSETS: Toolset[] = ["generation", "processing", "styles"];

export const parseToolsets = (env?: string): Set<Toolset> => {
  if (!env) return new Set(ALL_TOOLSETS);

  const requested = env.split(",").map((s) => s.trim().toLowerCase());
  const valid = new Set<Toolset>();

  for (const name of requested) {
    if (ALL_TOOLSETS.includes(name as Toolset)) {
      valid.add(name as Toolset);
    }
  }

  return valid.size > 0 ? valid : new Set(ALL_TOOLSETS);
};

type ToolRegisterer = (server: McpServer, client: RecraftClient) => void;

const toolsetRegistry: Record<Toolset, ToolRegisterer[]> = {
  generation: [registerGenerationTools],
  processing: [registerProcessingTools],
  styles: [registerStyleTools],
};

export const createServer = (
  client: RecraftClient,
  toolsets?: Set<Toolset>,
): McpServer => {
  const server = new McpServer({
    name: "recraft-mcp",
    version,
  });

  const enabled = toolsets ?? new Set(ALL_TOOLSETS);
  const registered = new Set<ToolRegisterer>();

  for (const toolset of enabled) {
    const registerers = toolsetRegistry[toolset];

    for (const register of registerers) {
      if (!registered.has(register)) {
        registered.add(register);
        register(server, client);
      }
    }
  }

  return server;
};
