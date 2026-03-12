import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RecraftClient, RecraftApiError } from "./recraft-client.js";

describe("RecraftClient", () => {
  let client: RecraftClient;

  beforeEach(() => {
    client = new RecraftClient("test-token", "https://api.test.com/v1", 0, { maxRetries: 0 });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateImage", () => {
    it("should send JSON POST request with auth header", async () => {
      const mockResponse = {
        created: 123,
        credits: 40,
        data: [{ image_id: "abc", url: "https://img.test/1.png" }],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockResponse,
      } as Response);

      const result = await client.generateImage({ prompt: "a cat" });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.test.com/v1/images/generations",
        expect.objectContaining({
          method: "POST",
        }),
      );

      const call = vi.mocked(fetch).mock.calls[0];
      const headers = call[1]?.headers as Headers;
      expect(headers.get("Authorization")).toBe("Bearer test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getCurrentUser", () => {
    it("should return user info", async () => {
      const mockUser = { id: "u1", credits: 1000, email: "test@test.com", name: "Test" };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockUser,
      } as Response);

      const result = await client.getCurrentUser();
      expect(result).toEqual(mockUser);
    });
  });

  describe("error handling", () => {
    it("should throw RecraftApiError on non-ok response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "invalid token" }),
      } as Response);

      await expect(client.generateImage({ prompt: "test" }))
        .rejects.toThrow(RecraftApiError);
    });

    it("should include status in error", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "invalid prompt" }),
      } as Response);

      try {
        await client.generateImage({ prompt: "" });
      } catch (error) {
        expect(error).toBeInstanceOf(RecraftApiError);
        expect((error as RecraftApiError).status).toBe(400);
      }
    });
  });

  describe("retry on 429", () => {
    it("should retry on rate limit with maxRetries > 0", async () => {
      const retryClient = new RecraftClient("test-token", "https://api.test.com/v1", 0, { maxRetries: 1 });

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          headers: new Headers(),
          json: async () => ({}),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ created: 1, credits: 10, data: [] }),
        } as Response);

      const result = await retryClient.generateImage({ prompt: "test" });
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result.data).toEqual([]);
    });
  });

  describe("style operations", () => {
    it("should list styles", async () => {
      const mockStyles = { styles: [{ id: "s1", style: "realistic_image" }] };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockStyles,
      } as Response);

      const result = await client.listStyles();
      expect(result.styles).toHaveLength(1);
    });

    it("should delete style", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      } as Response);

      await expect(client.deleteStyle("test-id")).resolves.toBeUndefined();
    });
  });
});
