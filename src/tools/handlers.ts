/**
 * @fileoverview Main handlers file that combines and delegates to specialized handlers.
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { RecraftHandlers } from "./recraft-handlers.js";
import { validateSchemaAs } from "../schemas/validation.js";
import { GenerateImageArgsSchema } from "../schemas/recraft.js";

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
    return this.recraftHandlers.handleInpaintImage(args);
  }

  /**
   * Handles background replacement
   * @param args - Arguments for background replacement
   * @returns Response with image information
   */
  public async handleReplaceBackground(args: unknown) {
    return this.recraftHandlers.handleReplaceBackground(args);
  }

  /**
   * Handles image vectorization
   * @param args - Arguments for image vectorization
   * @returns Response with vectorized image information
   */
  public async handleVectorizeImage(args: unknown) {
    return this.recraftHandlers.handleVectorizeImage(args);
  }

  /**
   * Handles background removal
   * @param args - Arguments for background removal
   * @returns Response with image information
   */
  public async handleRemoveBackground(args: unknown) {
    return this.recraftHandlers.handleRemoveBackground(args);
  }

  /**
   * Handles crisp upscale
   * @param args - Arguments for crisp upscale
   * @returns Response with upscaled image information
   */
  public async handleCrispUpscale(args: unknown) {
    return this.recraftHandlers.handleCrispUpscale(args);
  }

  /**
   * Handles creative upscale
   * @param args - Arguments for creative upscale
   * @returns Response with upscaled image information
   */
  public async handleCreativeUpscale(args: unknown) {
    return this.recraftHandlers.handleCreativeUpscale(args);
  }

  /**
   * Handles style creation
   * @param args - Arguments for style creation
   * @returns Response with style information
   */
  public async handleCreateStyle(args: unknown) {
    return this.recraftHandlers.handleCreateStyle(args);
  }

  /**
   * Handles getting user information
   * @returns Response with user information
   */
  public async handleGetUserInfo() {
    return this.recraftHandlers.handleGetUserInfo();
  }

  /**
   * Handles saving an image to disk
   * @param args - Arguments for saving the image
   * @returns Response with saved image information
   */
  public async handleSaveImageToDisk(args: unknown) {
    return this.recraftHandlers.handleSaveImageToDisk(args);
  }
}
