import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";
import type { RecraftClient } from "../recraft-client.js";
import type { ProcessImageResponse } from "../types.js";
import { toTextResult, toErrorResult } from "../tool-result.js";

const imageFormatEnum = z.enum(["webp", "png"]);

const formatProcessResponse = (response: ProcessImageResponse, operation: string): string => {
  const img = response.image;
  return [
    `${operation} complete (${response.credits} credits used)`,
    `  URL: ${img.url ?? "(base64)"}`,
    `  ID: ${img.image_id}`,
  ].join("\n");
};

export const registerProcessingTools = (server: McpServer, client: RecraftClient): void => {
  server.registerTool(
    "remove_background",
    {
      title: "Remove Background",
      description:
        "Remove the background from an image, leaving a transparent background. " +
        "Provide the image as a URL or base64-encoded string.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Image as a URL or base64-encoded string."),
        image_format: imageFormatEnum.optional().describe("Output format: webp or png."),
      }),
    },
    async ({ image, image_format }) => {
      try {
        const response = await client.removeBackground({ image, image_format });
        return toTextResult(formatProcessResponse(response, "Background removal"), {
          created: response.created,
          credits: response.credits,
          image: response.image,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "erase_region",
    {
      title: "Erase Region",
      description:
        "Erase a region from an image defined by a mask. The erased area is filled seamlessly. " +
        "Provide the image and a grayscale mask (white = erase, black = preserve).",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Source image as a URL or base64-encoded string."),
        mask: z.string().min(1).describe("Grayscale mask as a URL or base64-encoded string. White = erase, black = preserve."),
        image_format: imageFormatEnum.optional().describe("Output format."),
      }),
    },
    async ({ image, mask, image_format }) => {
      try {
        const response = await client.eraseRegion({ image, mask, image_format });
        return toTextResult(formatProcessResponse(response, "Region erase"), {
          created: response.created,
          credits: response.credits,
          image: response.image,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "vectorize_image",
    {
      title: "Vectorize Image",
      description:
        "Convert a raster image (PNG/JPG/WEBP) to a scalable vector SVG format. " +
        "Useful for converting logos, icons, and illustrations to resolution-independent vectors.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Image to vectorize as a URL or base64-encoded string."),
      }),
    },
    async ({ image }) => {
      try {
        const response = await client.vectorize({ image });
        return toTextResult(formatProcessResponse(response, "Vectorization"), {
          created: response.created,
          credits: response.credits,
          image: response.image,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "crisp_upscale",
    {
      title: "Crisp Upscale",
      description:
        "Upscale an image with crisp, sharp detail preservation. Best for images where sharpness is important. " +
        "Input image must be max 5MB and <4MP.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Image to upscale as a URL or base64-encoded string. Max 5MB, <4MP."),
        image_format: imageFormatEnum.optional().describe("Output format."),
      }),
    },
    async ({ image, image_format }) => {
      try {
        const response = await client.crispUpscale({ image, image_format });
        return toTextResult(formatProcessResponse(response, "Crisp upscale"), {
          created: response.created,
          credits: response.credits,
          image: response.image,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "creative_upscale",
    {
      title: "Creative Upscale",
      description:
        "Upscale an image with creative enhancement — adds detail and improves quality beyond simple scaling. " +
        "Best for artistic images where added creative detail is desirable. Input image must be max 5MB and <16MP.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Image to upscale as a URL or base64-encoded string. Max 5MB, <16MP."),
        image_format: imageFormatEnum.optional().describe("Output format."),
      }),
    },
    async ({ image, image_format }) => {
      try {
        const response = await client.creativeUpscale({ image, image_format });
        return toTextResult(formatProcessResponse(response, "Creative upscale"), {
          created: response.created,
          credits: response.credits,
          image: response.image,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );
};
