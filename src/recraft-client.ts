import { TtlCache } from "./cache.js";
import type {
  GenerateImageParams,
  GenerateImageResponse,
  ImageToImageParams,
  InpaintParams,
  ReplaceBackgroundParams,
  GenerateBackgroundParams,
  ProcessImageParams,
  EraseRegionParams,
  ProcessImageResponse,
  CreateStyleParams,
  StyleResponse,
  StyleListResponse,
  UserResponse,
} from "./types.js";

export class RecraftApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export interface RetryOptions {
  maxRetries: number;
}

const DEFAULT_RETRY: RetryOptions = { maxRetries: 3 };

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isUrl = (value: string): boolean =>
  value.startsWith("http://") || value.startsWith("https://");

const fetchImageBlob = async (imageInput: string): Promise<Blob> => {
  if (isUrl(imageInput)) {
    const response = await fetch(imageInput);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.status} ${response.statusText}`);
    }
    return response.blob();
  }
  const raw = atob(imageInput);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return new Blob([bytes]);
};

export class RecraftClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly retry: RetryOptions;
  private readonly cache: TtlCache;
  private readonly cachingEnabled: boolean;

  constructor(
    apiToken: string,
    baseUrl = "https://external.api.recraft.ai/v1",
    cacheTtlMs?: number,
    retry: RetryOptions = DEFAULT_RETRY,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiToken = apiToken;
    this.retry = retry;
    this.cachingEnabled = cacheTtlMs !== 0;
    this.cache = new TtlCache(cacheTtlMs ?? 120_000);
  }

  private async cachedRequest<T>(cacheKey: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
    if (!this.cachingEnabled || ttlMs <= 0) return fetcher();

    const cached = this.cache.get<T>(cacheKey);
    if (cached !== undefined) return cached;

    const result = await fetcher();
    this.cache.set(cacheKey, result, ttlMs);
    return result;
  }

  // --- Generation ---

  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    return this.jsonRequest<GenerateImageResponse>("/images/generations", { ...params });
  }

  async imageToImage(params: ImageToImageParams): Promise<GenerateImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<GenerateImageResponse>("/images/imageToImage", form);
  }

  async inpaint(params: InpaintParams): Promise<GenerateImageResponse> {
    const { image, mask, ...rest } = params;
    const form = await this.buildFormData({ image, mask }, rest);
    return this.multipartRequest<GenerateImageResponse>("/images/inpaint", form);
  }

  async replaceBackground(params: ReplaceBackgroundParams): Promise<GenerateImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<GenerateImageResponse>("/images/replaceBackground", form);
  }

  async generateBackground(params: GenerateBackgroundParams): Promise<GenerateImageResponse> {
    const { image, mask, ...rest } = params;
    const form = await this.buildFormData({ image, mask }, rest);
    return this.multipartRequest<GenerateImageResponse>("/images/generateBackground", form);
  }

  // --- Processing ---

  async removeBackground(params: ProcessImageParams): Promise<ProcessImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<ProcessImageResponse>("/images/removeBackground", form);
  }

  async eraseRegion(params: EraseRegionParams): Promise<ProcessImageResponse> {
    const { image, mask, ...rest } = params;
    const form = await this.buildFormData({ image, mask }, rest);
    return this.multipartRequest<ProcessImageResponse>("/images/eraseRegion", form);
  }

  async vectorize(params: ProcessImageParams): Promise<ProcessImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<ProcessImageResponse>("/images/vectorize", form);
  }

  async crispUpscale(params: ProcessImageParams): Promise<ProcessImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<ProcessImageResponse>("/images/crispUpscale", form);
  }

  async creativeUpscale(params: ProcessImageParams): Promise<ProcessImageResponse> {
    const { image, ...rest } = params;
    const form = await this.buildFormData({ image }, rest);
    return this.multipartRequest<ProcessImageResponse>("/images/creativeUpscale", form);
  }

  // --- Styles ---

  async createStyle(params: CreateStyleParams): Promise<{ id: string }> {
    const form = new FormData();
    for (const imageInput of params.images) {
      const blob = await fetchImageBlob(imageInput);
      form.append("images", blob, "image.png");
    }
    form.append("style", params.style);
    return this.multipartRequest<{ id: string }>("/styles", form);
  }

  async getStyle(styleId: string): Promise<StyleResponse> {
    return this.cachedRequest(
      `style:${styleId}`,
      300_000,
      () => this.request<StyleResponse>(`/styles/${encodeURIComponent(styleId)}`),
    );
  }

  async listStyles(): Promise<StyleListResponse> {
    return this.cachedRequest(
      "styles:list",
      60_000,
      () => this.request<StyleListResponse>("/styles"),
    );
  }

  async listBasicStyles(): Promise<StyleListResponse> {
    return this.cachedRequest(
      "styles:basic",
      600_000,
      () => this.request<StyleListResponse>("/styles/basic"),
    );
  }

  async deleteStyle(styleId: string): Promise<void> {
    await this.request<unknown>(`/styles/${encodeURIComponent(styleId)}`, { method: "DELETE" });
    this.cache.invalidate("styles:");
  }

  // --- User ---

  async getCurrentUser(): Promise<UserResponse> {
    return this.cachedRequest(
      "user:me",
      60_000,
      () => this.request<UserResponse>("/users/me"),
    );
  }

  // --- Private ---

  private async buildFormData(
    files: Record<string, string>,
    fields: Record<string, unknown>,
  ): Promise<FormData> {
    const form = new FormData();

    for (const [name, imageInput] of Object.entries(files)) {
      const blob = await fetchImageBlob(imageInput);
      form.append(name, blob, `${name}.png`);
    }

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null) continue;
      if (typeof value === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    }

    return form;
  }

  private static async parseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? "";
    return contentType.includes("application/json")
      ? response.json().catch(() => null)
      : response.text().catch(() => "");
  }

  private async jsonRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private async multipartRequest<T>(path: string, form: FormData): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: form,
    });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${this.apiToken}`);

    const url = `${this.baseUrl}${path}`;
    const requestInit: RequestInit = { ...init, headers };

    const maxRetries = Math.max(0, this.retry.maxRetries);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch(url, requestInit);

      if (response.ok) {
        return await RecraftClient.parseBody(response) as T;
      }

      if (response.status === 429 && attempt < maxRetries) {
        const retryAfter = response.headers.get("retry-after");
        const delayMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.pow(2, attempt) * 1000;
        await sleep(delayMs);
        continue;
      }

      throw new RecraftApiError(
        `Recraft API request failed: ${response.status} ${response.statusText}`,
        response.status,
        await RecraftClient.parseBody(response),
      );
    }

    /* v8 ignore next */
    throw new Error("Retry loop exited unexpectedly");
  }
}
