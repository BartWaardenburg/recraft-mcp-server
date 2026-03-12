import { describe, it, expect } from "vitest";
import { toTextResult, toErrorResult } from "./tool-result.js";
import { RecraftApiError } from "./recraft-client.js";

describe("toTextResult", () => {
  it("should return text content", () => {
    const result = toTextResult("hello");
    expect(result.content).toEqual([{ type: "text", text: "hello" }]);
  });

  it("should include structured content when provided", () => {
    const result = toTextResult("hello", { key: "value" });
    expect(result.structuredContent).toEqual({ key: "value" });
  });

  it("should omit structured content when not provided", () => {
    const result = toTextResult("hello");
    expect(result).not.toHaveProperty("structuredContent");
  });
});

describe("toErrorResult", () => {
  it("should format RecraftApiError with status", () => {
    const error = new RecraftApiError("Not found", 404);
    const result = toErrorResult(error);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("404");
    expect(result.content[0].text).toContain("Recovery:");
  });

  it("should include recovery suggestion for 429", () => {
    const error = new RecraftApiError("Too many requests", 429);
    const result = toErrorResult(error);
    expect(result.content[0].text).toContain("Rate limit");
  });

  it("should include recovery suggestion for 401", () => {
    const error = new RecraftApiError("Unauthorized", 401);
    const result = toErrorResult(error);
    expect(result.content[0].text).toContain("RECRAFT_API_TOKEN");
  });

  it("should include recovery suggestion for 400 with prompt hint", () => {
    const error = new RecraftApiError("Invalid prompt length", 400);
    const result = toErrorResult(error);
    expect(result.content[0].text).toContain("1-1000 characters");
  });

  it("should include recovery suggestion for 500", () => {
    const error = new RecraftApiError("Internal server error", 500);
    const result = toErrorResult(error);
    expect(result.content[0].text).toContain("temporary issue");
  });

  it("should handle generic errors", () => {
    const result = toErrorResult(new Error("something broke"));
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("something broke");
  });

  it("should handle non-error values", () => {
    const result = toErrorResult("string error");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("string error");
  });

  it("should include details when present", () => {
    const error = new RecraftApiError("Bad request", 400, { field: "prompt" });
    const result = toErrorResult(error);
    expect(result.content[0].text).toContain('"field"');
  });
});
