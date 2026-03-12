import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isNewerVersion, checkForUpdate } from "./update-checker.js";

describe("isNewerVersion", () => {
  it("should detect newer major version", () => {
    expect(isNewerVersion("2.0.0", "1.0.0")).toBe(true);
  });

  it("should detect newer minor version", () => {
    expect(isNewerVersion("1.1.0", "1.0.0")).toBe(true);
  });

  it("should detect newer patch version", () => {
    expect(isNewerVersion("1.0.1", "1.0.0")).toBe(true);
  });

  it("should return false for same version", () => {
    expect(isNewerVersion("1.0.0", "1.0.0")).toBe(false);
  });

  it("should return false for older version", () => {
    expect(isNewerVersion("1.0.0", "2.0.0")).toBe(false);
  });
});

describe("checkForUpdate", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should notify when update is available", async () => {
    const writeSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ version: "2.0.0" }),
    } as Response);

    await checkForUpdate("recraft-mcp", "1.0.0");
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining("Update available"));
  });

  it("should not notify when up to date", async () => {
    const writeSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ version: "1.0.0" }),
    } as Response);

    await checkForUpdate("recraft-mcp", "1.0.0");
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("should silently handle network errors", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));
    await expect(checkForUpdate("recraft-mcp", "1.0.0")).resolves.toBeUndefined();
  });
});
