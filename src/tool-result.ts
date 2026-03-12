import { RecraftApiError } from "./recraft-client.js";

export const toTextResult = (
  text: string,
  structuredContent?: Record<string, unknown>,
) => ({
  content: [{ type: "text" as const, text }],
  ...(structuredContent ? { structuredContent } : {}),
});

const getRecoverySuggestion = (status: number, message: string): string | null => {
  if (status === 429) {
    return "Rate limit exceeded. Wait a moment and retry, or reduce the frequency of API calls. Limits: 100 images/min, 5 requests/sec.";
  }

  if (status === 404) {
    return "Resource not found. Verify the style ID is correct.";
  }

  if (status === 401 || status === 403) {
    return "Authentication failed. Verify that the RECRAFT_API_TOKEN environment variable is set correctly and has not expired. Get a token at https://www.recraft.ai/profile/api.";
  }

  if (status === 400) {
    const lower = message.toLowerCase();
    if (lower.includes("prompt")) {
      return "Invalid prompt. Prompts must be 1-1000 characters for V2/V3 models, or up to 10000 characters for V4.";
    }
    if (lower.includes("style")) {
      return "Invalid style. V4 models do not support style parameters — use the prompt to control style instead.";
    }
    if (lower.includes("size")) {
      return "Invalid image size. Supported sizes include: 1024x1024, 1365x1024, 1024x1365, 1536x1024, 1024x1536, 1820x1024, 1024x1820, and more.";
    }
    return "Invalid request parameters. Check that all values are in the correct format.";
  }

  if (status >= 500) {
    return "Recraft API server error. This is a temporary issue on Recraft's end. Wait a moment and retry the operation.";
  }

  return null;
};

export const toErrorResult = (error: unknown) => {
  if (error instanceof RecraftApiError) {
    const suggestion = getRecoverySuggestion(error.status, error.message);

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `Recraft API error: ${error.message}`,
            `Status: ${error.status}`,
            error.details ? `Details: ${JSON.stringify(error.details, null, 2)}` : "",
            suggestion ? `\nRecovery: ${suggestion}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: error instanceof Error ? error.message : String(error),
      },
    ],
    isError: true,
  };
};
