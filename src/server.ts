import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/server";
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

const INSTRUCTIONS = [
  "Generate and edit images with the Recraft API.",
  "Call generate_image to make an image from a text prompt. Use image_to_image or inpaint_image to change an existing image.",
  "Call remove_background, vectorize_image, crisp_upscale or creative_upscale to process an image.",
  "Call list_styles to find a style. Call create_style to make a custom style from reference images.",
  "The env var RECRAFT_API_TOKEN is required. The API limits the request rate, and the server retries after a 429 response.",
].join("\n");

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
  const server = new McpServer(
    {
      name: "recraft-mcp",
      title: "Recraft",
      version,
      websiteUrl: "https://www.recraft.ai",
    },
    { instructions: INSTRUCTIONS },
  );

  const enabled = toolsets ?? new Set(ALL_TOOLSETS);
  const registered = new Set<ToolRegisterer>();

  // Iterate the fixed list, not the user input, so tools/list has one stable order.
  for (const toolset of ALL_TOOLSETS.filter((t) => enabled.has(t))) {
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
