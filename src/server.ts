import { FastMCP, imageContent, UserError } from "fastmcp";
import { z } from "zod";
import {
  GenerateImageArgsSchema,
  ImageToImageArgsSchema,
  InpaintImageArgsSchema,
  ReplaceBackgroundArgsSchema,
  VectorizeImageArgsSchema,
  RemoveBackgroundArgsSchema,
  CrispUpscaleArgsSchema,
  CreativeUpscaleArgsSchema,
  CreateStyleArgsSchema,
  SaveImageToDiskArgsSchema,
} from "./schemas/recraft.js";
import { ToolHandlers } from "./tools/handlers.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";

/* Get package info */
const getPackageInfo = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = resolve(__dirname, "../package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (error) {
    console.error("Error reading package.json:", error);
    return {
      name: "recraft-mcp-server",
      version: "0.1.0",
    };
  }
};

/* Initialize FastMCP server */
const { name, version } = getPackageInfo();

export const server = new FastMCP({
  name,
  version,
});

/* Initialize tool handlers */
const toolHandlers = new ToolHandlers();

/* Add tools */
server.addTool({
  name: "generate_image",
  description:
    "Generate an image from a text prompt with optional saving to disk",
  parameters: GenerateImageArgsSchema,
  execute: async (args, { log }) => {
    try {
      log.info("Generating image...", { prompt: args.prompt });
      const response = await toolHandlers.handleGenerateImage(args);

      const imageData = response.data?.[0];
      if (!imageData) {
        throw new UserError("Failed to generate image: No image data received");
      }

      // Handle saving to disk if requested
      if (args.save_to_disk && args.output_path && args.filename) {
        log.info("Saving image to disk...", {
          path: args.output_path,
          filename: args.filename,
        });

        try {
          await toolHandlers.handleSaveImageToDisk({
            image_url: imageData.url,
            image_b64: imageData.b64_json,
            output_path: args.output_path,
            filename: args.filename,
          });

          log.info("Image saved successfully", {
            path: `${args.output_path}/${args.filename}`,
          });
        } catch (error) {
          throw new UserError(
            `Failed to save image: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      const successMessage = args.save_to_disk
        ? `Image generated and saved to: ${args.output_path}/${args.filename}`
        : "Image generated successfully";

      // Return image content
      if (imageData.b64_json) {
        return {
          content: [
            { type: "text", text: successMessage },
            {
              type: "image",
              data: imageData.b64_json,
              mimeType: "image/png",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `${successMessage}\nImage URL: ${imageData.url}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError(
        `Failed to process image generation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
});

server.addTool({
  name: "image_to_image",
  description: "Transform an existing image based on a text prompt",
  parameters: ImageToImageArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleImageToImage(args);
    if (response.data?.[0]?.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.data[0].b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.data[0].url }] };
  },
});

server.addTool({
  name: "inpaint_image",
  description: "Inpaint (edit) parts of an image using a mask",
  parameters: InpaintImageArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleInpaintImage(args);
    if (response.data?.[0]?.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.data[0].b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.data[0].url }] };
  },
});

server.addTool({
  name: "replace_background",
  description: "Replace the background of an image",
  parameters: ReplaceBackgroundArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleReplaceBackground(args);
    if (response.data?.[0]?.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.data[0].b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.data[0].url }] };
  },
});

server.addTool({
  name: "vectorize_image",
  description: "Vectorize an image to SVG format",
  parameters: VectorizeImageArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleVectorizeImage(args);
    return { content: [{ type: "text", text: response.image.url }] };
  },
});

server.addTool({
  name: "remove_background",
  description: "Remove the background from an image",
  parameters: RemoveBackgroundArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleRemoveBackground(args);
    if (response.image.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.image.b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.image.url }] };
  },
});

server.addTool({
  name: "crisp_upscale",
  description: "Enhance image resolution with crisp upscale",
  parameters: CrispUpscaleArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleCrispUpscale(args);
    if (response.image.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.image.b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.image.url }] };
  },
});

server.addTool({
  name: "creative_upscale",
  description: "Enhance image with creative upscale for improved details",
  parameters: CreativeUpscaleArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleCreativeUpscale(args);
    if (response.image.b64_json) {
      return imageContent({
        buffer: Buffer.from(response.image.b64_json, "base64"),
      });
    }
    return { content: [{ type: "text", text: response.image.url }] };
  },
});

server.addTool({
  name: "create_style",
  description: "Create a style by uploading reference images",
  parameters: CreateStyleArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleCreateStyle(args);
    return {
      content: [
        { type: "text", text: `Style created with ID: ${response.id}` },
      ],
    };
  },
});

server.addTool({
  name: "get_user_info",
  description: "Get information about the current user",
  parameters: z.object({}),
  execute: async () => {
    const response = await toolHandlers.handleGetUserInfo();
    return {
      content: [
        {
          type: "text",
          text: `User: ${response.name} (${response.email})\nCredits: ${response.credits}`,
        },
      ],
    };
  },
});

server.addTool({
  name: "save_image_to_disk",
  description: "Save an image response to disk in a specified folder",
  parameters: SaveImageToDiskArgsSchema,
  execute: async (args) => {
    const response = await toolHandlers.handleSaveImageToDisk(args);
    return {
      content: [
        {
          type: "text",
          text: `Image saved to: ${response.file_path}`,
        },
      ],
    };
  },
});
