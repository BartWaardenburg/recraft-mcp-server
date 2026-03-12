import { describe, it, expect, vi, beforeEach } from "vitest";
import { TtlCache } from "./cache.js";

describe("TtlCache", () => {
  let cache: TtlCache;

  beforeEach(() => {
    cache = new TtlCache(1000);
  });

  it("should return undefined for missing keys", () => {
    expect(cache.get("missing")).toBeUndefined();
  });

  it("should store and retrieve values", () => {
    cache.set("key", "value");
    expect(cache.get("key")).toBe("value");
  });

  it("should expire entries after TTL", () => {
    vi.useFakeTimers();
    cache.set("key", "value", 100);
    vi.advanceTimersByTime(101);
    expect(cache.get("key")).toBeUndefined();
    vi.useRealTimers();
  });

  it("should not expire entries before TTL", () => {
    vi.useFakeTimers();
    cache.set("key", "value", 100);
    vi.advanceTimersByTime(50);
    expect(cache.get("key")).toBe("value");
    vi.useRealTimers();
  });

  it("should invalidate by pattern", () => {
    cache.set("style:abc", "one");
    cache.set("style:def", "two");
    cache.set("user:me", "three");
    cache.invalidate("style:");
    expect(cache.get("style:abc")).toBeUndefined();
    expect(cache.get("style:def")).toBeUndefined();
    expect(cache.get("user:me")).toBe("three");
  });

  it("should clear all entries", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.size).toBe(0);
  });

  it("should report size", () => {
    expect(cache.size).toBe(0);
    cache.set("a", 1);
    expect(cache.size).toBe(1);
  });
});
