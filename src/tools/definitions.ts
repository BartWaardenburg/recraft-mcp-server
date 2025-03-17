/**
 * Tool definitions for the MCP server
 * @description Defines all available tools and their input schemas for the MCP server
 * @module toolDefinitions
 */

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
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
 * Tool definitions using Zod schemas converted to JSON Schema for MCP compatibility
 */
export const toolDefinitions = {
  /**
   * Generate an image from a text prompt
   */
  generate_image: {
    description: "Generate an image from a text prompt",
    inputSchema: zodToJsonSchema(GenerateImageArgsSchema),
  },

  /**
   * Transform an existing image based on a text prompt
   */
  image_to_image: {
    description: "Transform an existing image based on a text prompt",
    inputSchema: zodToJsonSchema(ImageToImageArgsSchema),
  },

  /**
   * Inpaint (edit) parts of an image using a mask
   */
  inpaint_image: {
    description: "Inpaint (edit) parts of an image using a mask",
    inputSchema: zodToJsonSchema(InpaintImageArgsSchema),
  },

  /**
   * Replace the background of an image
   */
  replace_background: {
    description: "Replace the background of an image",
    inputSchema: zodToJsonSchema(ReplaceBackgroundArgsSchema),
  },

  /**
   * Vectorize an image to SVG format
   */
  vectorize_image: {
    description: "Vectorize an image to SVG format",
    inputSchema: zodToJsonSchema(VectorizeImageArgsSchema),
  },

  /**
   * Remove the background from an image
   */
  remove_background: {
    description: "Remove the background from an image",
    inputSchema: zodToJsonSchema(RemoveBackgroundArgsSchema),
  },

  /**
   * Enhance image resolution with crisp upscale
   */
  crisp_upscale: {
    description: "Enhance image resolution with crisp upscale",
    inputSchema: zodToJsonSchema(CrispUpscaleArgsSchema),
  },

  /**
   * Enhance image with creative upscale for improved details
   */
  creative_upscale: {
    description: "Enhance image with creative upscale for improved details",
    inputSchema: zodToJsonSchema(CreativeUpscaleArgsSchema),
  },

  /**
   * Create a style by uploading reference images
   */
  create_style: {
    description: "Create a style by uploading reference images",
    inputSchema: zodToJsonSchema(CreateStyleArgsSchema),
  },

  /**
   * Get current user information
   */
  get_user_info: {
    description: "Get information about the current user",
    inputSchema: zodToJsonSchema(z.object({}).strict()),
  },

  /**
   * Save an image to disk
   */
  save_image_to_disk: {
    description: "Save an image response to disk in a specified folder",
    inputSchema: zodToJsonSchema(SaveImageToDiskArgsSchema),
  },
} as const;
