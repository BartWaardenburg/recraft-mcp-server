import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";
import type { RecraftClient } from "../recraft-client.js";
import type { GenerateImageResponse } from "../types.js";
import { toTextResult, toErrorResult } from "../tool-result.js";

const styleEnum = z.enum([
  "realistic_image",
  "digital_illustration",
  "vector_illustration",
  "icon",
  "logo_raster",
]);

const modelEnum = z.enum([
  "recraftv4",
  "recraftv4_vector",
  "recraftv3",
  "recraftv2",
  "recraft20b",
  "refm1",
]);

const sizeEnum = z.enum([
  "1024x1024",
  "1365x1024",
  "1024x1365",
  "1536x1024",
  "1024x1536",
  "1820x1024",
  "1024x1820",
  "1024x2048",
  "2048x1024",
  "1434x1024",
  "1024x1434",
  "1024x1280",
  "1280x1024",
  "1024x1707",
  "1707x1024",
]);

const imageFormatEnum = z.enum(["webp", "png"]);

const formatGenerationResponse = (response: GenerateImageResponse): string => {
  const images = response.data.map((img, i) => {
    const parts = [`  Image ${i + 1}: ${img.url ?? "(base64)"}`, `  ID: ${img.image_id}`];
    if (img.revised_prompt) parts.push(`  Revised prompt: ${img.revised_prompt}`);
    return parts.join("\n");
  });

  return [
    `Generated ${response.data.length} image${response.data.length !== 1 ? "s" : ""} (${response.credits} credits used)`,
    ...images,
  ].join("\n");
};

export const registerGenerationTools = (server: McpServer, client: RecraftClient): void => {
  server.registerTool(
    "generate_image",
    {
      title: "Generate Image",
      description:
        "Generate images from a text prompt using Recraft AI. Supports multiple styles (realistic, illustration, vector, icon, logo), " +
        "various sizes, and fine-tuning controls like color palette and artistic level. " +
        "V4 models do not support style parameters — use the prompt to control style instead.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        prompt: z.string().min(1).max(10000).describe("Text description of the image to generate. Max 1000 chars for V2/V3, 10000 for V4."),
        model: modelEnum.optional().describe("Model to use. Default: recraftv3."),
        style: styleEnum.optional().describe("Style category. Not supported for V4 models. Default: realistic_image."),
        substyle: z.string().optional().describe("Substyle to refine the style (e.g. 'b_and_w', 'pixel_art', 'watercolor')."),
        style_id: z.string().uuid().optional().describe("Custom style ID. Cannot be used together with style/substyle."),
        size: sizeEnum.optional().describe("Image dimensions as WxH. Default: 1024x1024."),
        n: z.number().int().min(1).max(6).optional().describe("Number of images to generate (1-6). Default: 1."),
        negative_prompt: z.string().optional().describe("What to avoid in the generated image."),
        artistic_level: z.number().int().min(0).max(5).optional().describe("Artistic level from 0 (simple) to 5 (dynamic)."),
        no_text: z.boolean().optional().describe("Prevent text from appearing in the image."),
        image_format: imageFormatEnum.optional().describe("Output format: webp or png."),
        random_seed: z.number().int().optional().describe("Seed for reproducible results."),
      }),
    },
    async ({ prompt, model, style, substyle, style_id, size, n, negative_prompt, artistic_level, no_text, image_format, random_seed }) => {
      try {
        const controls = (artistic_level !== undefined || no_text !== undefined)
          ? { artistic_level, no_text }
          : undefined;

        const response = await client.generateImage({
          prompt,
          model,
          style,
          substyle: substyle as never,
          style_id,
          size,
          n,
          negative_prompt,
          controls,
          image_format,
          random_seed,
        });

        return toTextResult(formatGenerationResponse(response), {
          created: response.created,
          credits: response.credits,
          data: response.data,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "image_to_image",
    {
      title: "Image to Image",
      description:
        "Transform an existing image based on a text prompt. The strength parameter controls how much the image changes " +
        "(0.0 = minimal change, 1.0 = maximum change). Provide the image as a URL or base64-encoded string.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Source image as a URL or base64-encoded string. Max 5MB, <16MP, max 4096px per side."),
        prompt: z.string().min(1).describe("Description of desired changes to the image."),
        strength: z.number().min(0).max(1).describe("Change magnitude from 0.0 (minimal) to 1.0 (maximum)."),
        model: modelEnum.optional().describe("Model to use."),
        style: styleEnum.optional().describe("Style category. Not supported for V4 models."),
        substyle: z.string().optional().describe("Substyle to refine the style."),
        style_id: z.string().uuid().optional().describe("Custom style ID."),
        n: z.number().int().min(1).max(6).optional().describe("Number of output images (1-6)."),
        negative_prompt: z.string().optional().describe("What to avoid."),
        image_format: imageFormatEnum.optional().describe("Output format."),
        random_seed: z.number().int().optional().describe("Seed for reproducibility."),
      }),
    },
    async ({ image, prompt, strength, model, style, substyle, style_id, n, negative_prompt, image_format, random_seed }) => {
      try {
        const response = await client.imageToImage({
          image,
          prompt,
          strength,
          model,
          style,
          substyle: substyle as never,
          style_id,
          n,
          negative_prompt,
          image_format,
          random_seed,
        });

        return toTextResult(formatGenerationResponse(response), {
          created: response.created,
          credits: response.credits,
          data: response.data,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "inpaint_image",
    {
      title: "Inpaint Image",
      description:
        "Inpaint (fill in) a masked region of an image based on a text prompt. " +
        "Requires the original image and a grayscale mask (white = inpaint, black = preserve).",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Source image as a URL or base64-encoded string."),
        mask: z.string().min(1).describe("Grayscale PNG mask as a URL or base64-encoded string. White = areas to inpaint, black = areas to preserve."),
        prompt: z.string().min(1).describe("Description of what to generate in the masked area."),
        model: modelEnum.optional().describe("Model to use."),
        style: styleEnum.optional().describe("Style category."),
        substyle: z.string().optional().describe("Substyle."),
        style_id: z.string().uuid().optional().describe("Custom style ID."),
        n: z.number().int().min(1).max(6).optional().describe("Number of output images (1-6)."),
        negative_prompt: z.string().optional().describe("What to avoid."),
        image_format: imageFormatEnum.optional().describe("Output format."),
        random_seed: z.number().int().optional().describe("Seed for reproducibility."),
      }),
    },
    async ({ image, mask, prompt, model, style, substyle, style_id, n, negative_prompt, image_format, random_seed }) => {
      try {
        const response = await client.inpaint({
          image,
          mask,
          prompt,
          model,
          style,
          substyle: substyle as never,
          style_id,
          n,
          negative_prompt,
          image_format,
          random_seed,
        });

        return toTextResult(formatGenerationResponse(response), {
          created: response.created,
          credits: response.credits,
          data: response.data,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "replace_background",
    {
      title: "Replace Background",
      description:
        "Replace the background of an image while preserving the foreground subject. " +
        "Provide a text prompt describing the new background.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Source image as a URL or base64-encoded string."),
        prompt: z.string().min(1).describe("Description of the new background."),
        model: modelEnum.optional().describe("Model to use."),
        style: styleEnum.optional().describe("Style category."),
        substyle: z.string().optional().describe("Substyle."),
        style_id: z.string().uuid().optional().describe("Custom style ID."),
        n: z.number().int().min(1).max(6).optional().describe("Number of output images (1-6)."),
        negative_prompt: z.string().optional().describe("What to avoid."),
        image_format: imageFormatEnum.optional().describe("Output format."),
        random_seed: z.number().int().optional().describe("Seed for reproducibility."),
      }),
    },
    async ({ image, prompt, model, style, substyle, style_id, n, negative_prompt, image_format, random_seed }) => {
      try {
        const response = await client.replaceBackground({
          image,
          prompt,
          model,
          style,
          substyle: substyle as never,
          style_id,
          n,
          negative_prompt,
          image_format,
          random_seed,
        });

        return toTextResult(formatGenerationResponse(response), {
          created: response.created,
          credits: response.credits,
          data: response.data,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "generate_background",
    {
      title: "Generate Background",
      description:
        "Generate a background for an image using a mask to define the background area. " +
        "The mask indicates which areas should be filled with the generated background.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        image: z.string().min(1).describe("Source image as a URL or base64-encoded string."),
        mask: z.string().min(1).describe("Mask defining the background area as a URL or base64-encoded string."),
        prompt: z.string().min(1).describe("Description of the background to generate."),
        model: modelEnum.optional().describe("Model to use."),
        style: styleEnum.optional().describe("Style category."),
        substyle: z.string().optional().describe("Substyle."),
        style_id: z.string().uuid().optional().describe("Custom style ID."),
        n: z.number().int().min(1).max(6).optional().describe("Number of output images (1-6)."),
        negative_prompt: z.string().optional().describe("What to avoid."),
        image_format: imageFormatEnum.optional().describe("Output format."),
        random_seed: z.number().int().optional().describe("Seed for reproducibility."),
      }),
    },
    async ({ image, mask, prompt, model, style, substyle, style_id, n, negative_prompt, image_format, random_seed }) => {
      try {
        const response = await client.generateBackground({
          image,
          mask,
          prompt,
          model,
          style,
          substyle: substyle as never,
          style_id,
          n,
          negative_prompt,
          image_format,
          random_seed,
        });

        return toTextResult(formatGenerationResponse(response), {
          created: response.created,
          credits: response.credits,
          data: response.data,
        } as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );
};
