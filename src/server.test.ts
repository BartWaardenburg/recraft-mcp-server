import { describe, it, expect } from "vitest";
import { parseToolsets } from "./server.js";

describe("parseToolsets", () => {
  it("should return all toolsets when env is undefined", () => {
    const result = parseToolsets(undefined);
    expect(result).toEqual(new Set(["generation", "processing", "styles"]));
  });

  it("should return all toolsets when env is empty", () => {
    const result = parseToolsets("");
    expect(result).toEqual(new Set(["generation", "processing", "styles"]));
  });

  it("should parse single toolset", () => {
    const result = parseToolsets("generation");
    expect(result).toEqual(new Set(["generation"]));
  });

  it("should parse multiple toolsets", () => {
    const result = parseToolsets("generation,processing");
    expect(result).toEqual(new Set(["generation", "processing"]));
  });

  it("should handle whitespace", () => {
    const result = parseToolsets("generation , styles");
    expect(result).toEqual(new Set(["generation", "styles"]));
  });

  it("should ignore invalid toolset names", () => {
    const result = parseToolsets("generation,invalid");
    expect(result).toEqual(new Set(["generation"]));
  });

  it("should return all toolsets when all values are invalid", () => {
    const result = parseToolsets("invalid,nope");
    expect(result).toEqual(new Set(["generation", "processing", "styles"]));
  });

  it("should be case-insensitive", () => {
    const result = parseToolsets("Generation,PROCESSING");
    expect(result).toEqual(new Set(["generation", "processing"]));
  });
});
