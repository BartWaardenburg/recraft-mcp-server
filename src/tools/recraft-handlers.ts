/**
 * @fileoverview Handlers for Recraft API operations.
 * This file contains handlers for Recraft API operations.
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { RecraftApi } from "../services/recraft/index.js";
import fs from "fs";
import path from "path";
import https from "https";
import type {
  GenerateImageArgs,
  ImageToImageArgs,
  InpaintImageArgs,
  ReplaceBackgroundArgs,
  VectorizeImageArgs,
  RemoveBackgroundArgs,
  CrispUpscaleArgs,
  CreativeUpscaleArgs,
  CreateStyleArgs,
  SaveImageToDiskArgs,
} from "../schemas/recraft.js";
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
 * Class that handles Recraft API operations
 */
export class RecraftHandlers {
  private recraft: RecraftApi;

  /**
   * Initializes Recraft API client
   */
  constructor() {
    this.recraft = new RecraftApi();
  }

  /**
   * Validates arguments for generating an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateGenerateImageArgs(args: unknown): GenerateImageArgs {
    try {
      return validateSchemaAs<unknown, GenerateImageArgs>(
        GenerateImageArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for image-to-image transformation
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateImageToImageArgs(args: unknown): ImageToImageArgs {
    try {
      return validateSchemaAs<unknown, ImageToImageArgs>(
        ImageToImageArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for inpainting an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateInpaintImageArgs(args: unknown): InpaintImageArgs {
    try {
      return validateSchemaAs<unknown, InpaintImageArgs>(
        InpaintImageArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for replacing background in an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateReplaceBackgroundArgs(args: unknown): ReplaceBackgroundArgs {
    try {
      return validateSchemaAs<unknown, ReplaceBackgroundArgs>(
        ReplaceBackgroundArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for vectorizing an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateVectorizeImageArgs(args: unknown): VectorizeImageArgs {
    try {
      return validateSchemaAs<unknown, VectorizeImageArgs>(
        VectorizeImageArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for removing background from an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateRemoveBackgroundArgs(args: unknown): RemoveBackgroundArgs {
    try {
      return validateSchemaAs<unknown, RemoveBackgroundArgs>(
        RemoveBackgroundArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for crisp upscaling an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateCrispUpscaleArgs(args: unknown): CrispUpscaleArgs {
    try {
      return validateSchemaAs<unknown, CrispUpscaleArgs>(
        CrispUpscaleArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for creative upscaling an image
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateCreativeUpscaleArgs(args: unknown): CreativeUpscaleArgs {
    try {
      return validateSchemaAs<unknown, CreativeUpscaleArgs>(
        CreativeUpscaleArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for creating a style
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateCreateStyleArgs(args: unknown): CreateStyleArgs {
    try {
      return validateSchemaAs<unknown, CreateStyleArgs>(
        CreateStyleArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Validates arguments for saving an image to disk
   * @param args - The arguments to validate
   * @returns The validated arguments
   * @throws {McpError} If arguments are invalid
   */
  private validateSaveImageToDiskArgs(args: unknown): SaveImageToDiskArgs {
    try {
      return validateSchemaAs<unknown, SaveImageToDiskArgs>(
        SaveImageToDiskArgsSchema,
        args
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      throw new McpError(ErrorCode.InvalidParams, "Invalid arguments");
    }
  }

  /**
   * Generate an image based on a text prompt
   * @param args - The arguments for generating an image
   * @returns The generated image
   */
  public async handleGenerateImage(args: unknown) {
    const validatedArgs = this.validateGenerateImageArgs(args);
    const response = await this.recraft.generateImage(validatedArgs);
    return response;
  }

  /**
   * Transform an existing image based on a text prompt
   * @param args - The arguments for image-to-image transformation
   * @returns The transformed image
   */
  public async handleImageToImage(args: unknown) {
    const validatedArgs = this.validateImageToImageArgs(args);
    const response = await this.recraft.imageToImage(validatedArgs);
    return response;
  }

  /**
   * Inpaint parts of an image based on a mask
   * @param args - The arguments for inpainting an image
   * @returns The inpainted image
   */
  public async handleInpaintImage(args: unknown) {
    const validatedArgs = this.validateInpaintImageArgs(args);
    const response = await this.recraft.inpaintImage(validatedArgs);
    return response;
  }

  /**
   * Replace the background of an image
   * @param args - The arguments for replacing the background
   * @returns The image with replaced background
   */
  public async handleReplaceBackground(args: unknown) {
    const validatedArgs = this.validateReplaceBackgroundArgs(args);
    const response = await this.recraft.replaceBackground(validatedArgs);
    return response;
  }

  /**
   * Vectorize an image
   * @param args - The arguments for vectorizing an image
   * @returns The vectorized image
   */
  public async handleVectorizeImage(args: unknown) {
    const validatedArgs = this.validateVectorizeImageArgs(args);
    const response = await this.recraft.vectorizeImage(validatedArgs);
    return response;
  }

  /**
   * Remove the background from an image
   * @param args - The arguments for removing the background
   * @returns The image with background removed
   */
  public async handleRemoveBackground(args: unknown) {
    const validatedArgs = this.validateRemoveBackgroundArgs(args);
    const response = await this.recraft.removeBackground(validatedArgs);
    return response;
  }

  /**
   * Apply crisp upscaling to an image
   * @param args - The arguments for crisp upscaling
   * @returns The upscaled image
   */
  public async handleCrispUpscale(args: unknown) {
    const validatedArgs = this.validateCrispUpscaleArgs(args);
    const response = await this.recraft.crispUpscale(validatedArgs);
    return response;
  }

  /**
   * Apply creative upscaling to an image
   * @param args - The arguments for creative upscaling
   * @returns The creatively upscaled image
   */
  public async handleCreativeUpscale(args: unknown) {
    const validatedArgs = this.validateCreativeUpscaleArgs(args);
    const response = await this.recraft.creativeUpscale(validatedArgs);
    return response;
  }

  /**
   * Create a custom style
   * @param args - The arguments for creating a style
   * @returns The created style information
   */
  public async handleCreateStyle(args: unknown) {
    const validatedArgs = this.validateCreateStyleArgs(args);
    const response = await this.recraft.createStyle(validatedArgs);
    return response;
  }

  /**
   * Handles the request to get user information
   * @returns Response with user information
   */
  public async handleGetUserInfo() {
    const response = await this.recraft.getUserInfo();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  /**
   * Save an image to disk
   * @param args - The arguments for saving an image
   * @returns Information about the saved image
   */
  public async handleSaveImageToDisk(args: unknown): Promise<{
    success: boolean;
    file_path: string;
    message: string;
  }> {
    const validatedArgs = this.validateSaveImageToDiskArgs(args);
    const { image_url, image_b64, output_path, filename } = validatedArgs;

    try {
      // Create the directory if it doesn't exist
      fs.mkdirSync(output_path, { recursive: true });

      // Determine file extension based on image data
      let fileExtension = "png";

      if (image_b64) {
        // Handle base64 encoded image
        let imageData: Buffer;
        const match = image_b64.match(/^data:image\/([a-zA-Z]+);base64,/);
        if (match) {
          fileExtension = match[1];
          // Remove the metadata prefix
          const base64Data = image_b64.replace(
            /^data:image\/[a-zA-Z]+;base64,/,
            ""
          );
          imageData = Buffer.from(base64Data, "base64");
        } else {
          // If no metadata prefix, assume it's just base64 data
          imageData = Buffer.from(image_b64, "base64");
        }

        const outputFilePath = path.join(
          output_path,
          `${filename}.${fileExtension}`
        );
        fs.writeFileSync(outputFilePath, imageData);

        return {
          success: true,
          file_path: outputFilePath,
          message: `Image saved successfully to ${outputFilePath}`,
        };
      } else if (image_url) {
        // Handle image URL
        // Extract file extension from URL if possible
        const urlExtMatch = image_url.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
        if (urlExtMatch) {
          fileExtension = urlExtMatch[1];
        }

        const outputFilePath = path.join(
          output_path,
          `${filename}.${fileExtension}`
        );

        // Create a write stream
        const fileStream = fs.createWriteStream(outputFilePath);

        // Return a promise that resolves when the download is complete
        return new Promise<{
          success: boolean;
          file_path: string;
          message: string;
        }>((resolve, reject) => {
          https
            .get(image_url, (response) => {
              // Check if the response is successful
              if (response.statusCode !== 200) {
                fileStream.close();
                fs.unlinkSync(outputFilePath); // Remove the file if it exists
                reject(
                  new McpError(
                    ErrorCode.InternalError,
                    `Failed to download image: ${response.statusCode}`
                  )
                );
                return;
              }

              // Pipe the response to the file
              response.pipe(fileStream);

              // Handle errors
              fileStream.on("error", (err) => {
                fileStream.close();
                fs.unlinkSync(outputFilePath); // Remove the file if it exists
                reject(
                  new McpError(
                    ErrorCode.InternalError,
                    `Error saving file: ${err.message}`
                  )
                );
              });

              // Handle completion
              fileStream.on("finish", () => {
                fileStream.close();
                resolve({
                  success: true,
                  file_path: outputFilePath,
                  message: `Image saved successfully to ${outputFilePath}`,
                });
              });
            })
            .on("error", (err) => {
              fileStream.close();
              fs.unlinkSync(outputFilePath); // Remove the file if it exists
              reject(
                new McpError(
                  ErrorCode.InternalError,
                  `Error downloading image: ${err.message}`
                )
              );
            });
        });
      }

      throw new McpError(
        ErrorCode.InvalidParams,
        "Either image_url or image_b64 must be provided"
      );
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Error saving image: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
