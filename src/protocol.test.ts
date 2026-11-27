import { describe, it, expect, afterEach } from "vitest";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { createServer, parseToolsets, type Toolset } from "./server.js";
import type { RecraftClient } from "./recraft-client.js";

const mockClient = {} as RecraftClient;

const connect = async (
  toolsets?: Set<Toolset>,
): Promise<{ client: Client; close: () => Promise<void> }> => {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  const server = createServer(mockClient, toolsets);
  await server.connect(serverSide);
  const client = new Client({ name: "protocol-test", version: "0.0.0" });
  await client.connect(clientSide);
  return { client, close: async () => { await client.close(); await server.close(); } };
};

describe("MCP protocol surface", () => {
  let close: (() => Promise<void>) | undefined;
  afterEach(async () => { await close?.(); });

  it("gives instructions that name real tools", async () => {
    const conn = await connect();
    close = conn.close;
    const instructions = conn.client.getInstructions() ?? "";
    const { tools } = await conn.client.listTools();
    const names = tools.map((t) => t.name);
    expect(instructions).toMatch(/generate_image/);
    for (const used of instructions.match(/\b[a-z]+(?:_[a-z]+)+\b/g) ?? []) {
      if (/^(realistic|digital|vector)_/.test(used)) continue;
      expect(names, used).toContain(used);
    }
  });

  it("lists tools in the same order for any toolset order", async () => {
    const a = await connect(parseToolsets("generation,processing,styles"));
    const first = (await a.client.listTools()).tools.map((t) => t.name);
    await a.close();
    const b = await connect(parseToolsets("styles,processing,generation"));
    close = b.close;
    const second = (await b.client.listTools()).tools.map((t) => t.name);
    expect(second).toEqual(first);
  });

  it("lists every tool with a title and annotations", async () => {
    const conn = await connect();
    close = conn.close;
    const { tools } = await conn.client.listTools();
    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) {
      expect(tool.title, tool.name).toBeTruthy();
      expect(tool.annotations, tool.name).toBeDefined();
    }
  });
});
