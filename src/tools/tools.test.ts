import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RecraftClient } from "../recraft-client.js";
import { registerGenerationTools } from "./generation.js";
import { registerProcessingTools } from "./processing.js";
import { registerStyleTools } from "./styles.js";

describe("tool registration", () => {
  let server: McpServer;
  let client: RecraftClient;

  beforeEach(() => {
    server = new McpServer({ name: "test", version: "0.0.0" });
    client = new RecraftClient("test-token", "https://api.test.com/v1", 0, { maxRetries: 0 });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should register generation tools without errors", () => {
    expect(() => registerGenerationTools(server, client)).not.toThrow();
  });

  it("should register processing tools without errors", () => {
    expect(() => registerProcessingTools(server, client)).not.toThrow();
  });

  it("should register style tools without errors", () => {
    expect(() => registerStyleTools(server, client)).not.toThrow();
  });

  it("should register all tools together without conflicts", () => {
    expect(() => {
      registerGenerationTools(server, client);
      registerProcessingTools(server, client);
      registerStyleTools(server, client);
    }).not.toThrow();
  });
});
