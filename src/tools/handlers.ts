/**
 * @fileoverview Main handlers file that combines and delegates to specialized handlers.
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { RecraftHandlers } from "./recraft-handlers.js";
import { validateSchemaAs } from "../schemas/validation.js";
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
} from "../schemas/recraft.js";

/**
 * Main tool handlers class that delegates to specialized handlers
 */
export class ToolHandlers {
  private recraftHandlers: RecraftHandlers;

  /**
   * Initializes specialized handlers
   */
  constructor() {
    this.recraftHandlers = new RecraftHandlers();
  }

  /**
   * Handles image generation
   * @param args - Arguments for image generation
   * @returns Response with generated image information
   */
  public async handleGenerateImage(args: unknown) {
    try {
      // Validate input with Zod
      validateSchemaAs(
        GenerateImageArgsSchema,
        args,
        "Invalid image generation parameters"
      );

      // Process the validated request
      return await this.recraftHandlers.handleGenerateImage(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }

      throw new McpError(
        ErrorCode.InvalidParams,
        "Failed to generate image: unknown error"
      );
    }
  }

  /**
   * Handles image-to-image transformation
   * @param args - Arguments for image transformation
   * @returns Response with transformed image information
   */
  public async handleImageToImage(args: unknown) {
    try {
      validateSchemaAs(
        ImageToImageArgsSchema,
        args,
        "Invalid image-to-image parameters"
      );
      return await this.recraftHandlers.handleImageToImage(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to transform image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles image inpainting
   * @param args - Arguments for image inpainting
   * @returns Response with inpainted image information
   */
  public async handleInpaintImage(args: unknown) {
    try {
      validateSchemaAs(
        InpaintImageArgsSchema,
        args,
        "Invalid inpainting parameters"
      );
      return await this.recraftHandlers.handleInpaintImage(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to inpaint image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles background replacement
   * @param args - Arguments for background replacement
   * @returns Response with image information
   */
  public async handleReplaceBackground(args: unknown) {
    try {
      validateSchemaAs(
        ReplaceBackgroundArgsSchema,
        args,
        "Invalid background replacement parameters"
      );
      return await this.recraftHandlers.handleReplaceBackground(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to replace background: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles image vectorization
   * @param args - Arguments for image vectorization
   * @returns Response with vectorized image information
   */
  public async handleVectorizeImage(args: unknown) {
    try {
      validateSchemaAs(
        VectorizeImageArgsSchema,
        args,
        "Invalid vectorization parameters"
      );
      return await this.recraftHandlers.handleVectorizeImage(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to vectorize image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles background removal
   * @param args - Arguments for background removal
   * @returns Response with image information
   */
  public async handleRemoveBackground(args: unknown) {
    try {
      validateSchemaAs(
        RemoveBackgroundArgsSchema,
        args,
        "Invalid background removal parameters"
      );
      return await this.recraftHandlers.handleRemoveBackground(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to remove background: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles crisp upscale
   * @param args - Arguments for crisp upscale
   * @returns Response with upscaled image information
   */
  public async handleCrispUpscale(args: unknown) {
    try {
      validateSchemaAs(
        CrispUpscaleArgsSchema,
        args,
        "Invalid crisp upscale parameters"
      );
      return await this.recraftHandlers.handleCrispUpscale(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to upscale image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles creative upscale
   * @param args - Arguments for creative upscale
   * @returns Response with upscaled image information
   */
  public async handleCreativeUpscale(args: unknown) {
    try {
      validateSchemaAs(
        CreativeUpscaleArgsSchema,
        args,
        "Invalid creative upscale parameters"
      );
      return await this.recraftHandlers.handleCreativeUpscale(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to upscale image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles style creation
   * @param args - Arguments for style creation
   * @returns Response with style information
   */
  public async handleCreateStyle(args: unknown) {
    try {
      validateSchemaAs(
        CreateStyleArgsSchema,
        args,
        "Invalid style creation parameters"
      );
      return await this.recraftHandlers.handleCreateStyle(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to create style: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles getting user information
   * @returns Response with user information
   */
  public async handleGetUserInfo() {
    try {
      return await this.recraftHandlers.handleGetUserInfo();
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to get user info: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  /**
   * Handles saving an image to disk
   * @param args - Arguments for saving the image
   * @returns Response with saved image information
   */
  public async handleSaveImageToDisk(args: unknown) {
    try {
      validateSchemaAs(
        SaveImageToDiskArgsSchema,
        args,
        "Invalid save image parameters"
      );
      return await this.recraftHandlers.handleSaveImageToDisk(args);
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InvalidParams,
        `Failed to save image: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }
}
