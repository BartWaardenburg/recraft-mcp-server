/**
 * @fileoverview Zod schemas for Recraft API
 * This file contains Zod schemas for validating Recraft API requests and responses
 */

import { z } from "zod";
import {
  RecraftStyleV3Schema,
  RecraftSubstyleV3Schema,
  RecraftImageSizeSchema,
} from "./recraft-styles.js";

/**
 * Custom Zod refinement for Buffer or File
 */
const isBufferOrFile = (value: unknown): boolean => {
  return (
    value instanceof Buffer ||
    value instanceof File ||
    (typeof value === "object" && value !== null && "buffer" in value) ||
    typeof value === "string" // Allow string paths too
  );
};

/**
 * Schema for Buffer or File
 */
export const BufferOrFileSchema = z.custom<Buffer | File>(isBufferOrFile, {
  message: "Must be a Buffer, File, or string path",
});

/**
 * Base Response Schema for Recraft API
 */
export const RecraftBaseResponseSchema = z.object({
  isError: z.boolean().optional(),
  error: z.string().optional(),
});

/**
 * Response with a single image
 */
export const RecraftImageResponseSchema = RecraftBaseResponseSchema.extend({
  image: z.object({
    url: z.string().url(),
    b64_json: z.string().optional(),
  }),
});

/**
 * Response with multiple images
 */
export const RecraftImagesResponseSchema = RecraftBaseResponseSchema.extend({
  data: z.array(
    z.object({
      url: z.string().url(),
      b64_json: z.string().optional(),
    })
  ),
});

/**
 * Response for style creation
 */
export const RecraftStyleResponseSchema = RecraftBaseResponseSchema.extend({
  id: z.string(),
});

/**
 * Response for user info
 */
export const RecraftUserInfoResponseSchema = RecraftBaseResponseSchema.extend({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  credits: z.number().int().nonnegative(),
});

/**
 * Color schema
 */
export const RecraftColorSchema = z.object({
  rgb: z.tuple([
    z.number().int().min(0).max(255),
    z.number().int().min(0).max(255),
    z.number().int().min(0).max(255),
  ]),
});

/**
 * Bounding box schema
 */
export const RecraftBoundingBoxSchema = z.tuple([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number()]),
]);

/**
 * Text layout element schema
 */
export const RecraftTextLayoutElementSchema = z.object({
  text: z.string(),
  bbox: RecraftBoundingBoxSchema,
});

/**
 * Controls schema
 */
export const RecraftControlsSchema = z.object({
  artistic_level: z.number().min(0).max(5).optional(),
  colors: z.array(RecraftColorSchema).optional(),
  background_color: RecraftColorSchema.optional(),
  no_text: z.boolean().optional(),
});

/**
 * Base arguments schema
 */
export const RecraftBaseArgsSchema = z.object({
  model: z.enum(["recraftv2", "recraftv3"]).optional(),
  response_format: z.enum(["url", "b64_json"]).optional(),
});

/**
 * Generate image arguments schema
 */
export const GenerateImageArgsSchema = RecraftBaseArgsSchema.extend({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
  size: RecraftImageSizeSchema.optional(),
  negative_prompt: z.string().optional(),
  controls: RecraftControlsSchema.optional(),
  text_layout: z.array(RecraftTextLayoutElementSchema).optional(),
  /* Optional save parameters */
  save_to_disk: z.boolean().optional(),
  file_path: z
    .string()
    .min(1, "File path cannot be empty")
    .refine(
      (path) => !path || path.startsWith("/"),
      "File path must be absolute (start with '/')"
    )
    .optional(),
}).refine(
  (data) => {
    // If save_to_disk is true, file_path must be provided
    if (data.save_to_disk) {
      return data.file_path !== undefined;
    }
    return true;
  },
  {
    message: "file_path is required when save_to_disk is true",
    path: ["save_to_disk"],
  }
);

/**
 * Image to image arguments schema
 */
export const ImageToImageArgsSchema = RecraftBaseArgsSchema.extend({
  image: BufferOrFileSchema,
  prompt: z.string().min(1, "Prompt cannot be empty"),
  strength: z.union([
    z.number().min(0).max(1),
    z.string().transform((s) => parseFloat(s)),
  ]),
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
  negative_prompt: z.string().optional(),
  controls: RecraftControlsSchema.optional(),
});

/**
 * Inpaint image arguments schema
 */
export const InpaintImageArgsSchema = RecraftBaseArgsSchema.extend({
  image: BufferOrFileSchema,
  mask: BufferOrFileSchema,
  prompt: z.string().min(1, "Prompt cannot be empty"),
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
  negative_prompt: z.string().optional(),
});

/**
 * Replace background arguments schema
 */
export const ReplaceBackgroundArgsSchema = RecraftBaseArgsSchema.extend({
  image: BufferOrFileSchema,
  prompt: z.string().min(1, "Prompt cannot be empty"),
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
  negative_prompt: z.string().optional(),
});

/**
 * Vectorize image arguments schema
 */
export const VectorizeImageArgsSchema = RecraftBaseArgsSchema.extend({
  file: BufferOrFileSchema,
});

/**
 * Remove background arguments schema
 */
export const RemoveBackgroundArgsSchema = RecraftBaseArgsSchema.extend({
  file: BufferOrFileSchema,
});

/**
 * Crisp upscale arguments schema
 */
export const CrispUpscaleArgsSchema = RecraftBaseArgsSchema.extend({
  file: BufferOrFileSchema,
});

/**
 * Creative upscale arguments schema
 */
export const CreativeUpscaleArgsSchema = RecraftBaseArgsSchema.extend({
  file: BufferOrFileSchema,
});

/**
 * Create style arguments schema
 */
export const CreateStyleArgsSchema = z.object({
  style: z.string().min(1, "Style name cannot be empty"),
  files: z.array(BufferOrFileSchema).min(1, "At least one file is required"),
});

/**
 * Save image to disk arguments schema
 */
export const SaveImageToDiskArgsSchema = z
  .object({
    image_url: z.string().url().optional(),
    image_b64: z.string().optional(),
    file_path: z
      .string()
      .min(1, "File path cannot be empty")
      .refine(
        (path) => path.startsWith("/"),
        "File path must be absolute (start with '/')"
      ),
  })
  .refine(
    (data) => data.image_url !== undefined || data.image_b64 !== undefined,
    {
      message: "Either image_url or image_b64 must be provided",
      path: ["image_source"],
    }
  );

/**
 * Outpaint image arguments schema
 */
export const OutpaintImageArgsSchema = RecraftBaseArgsSchema.extend({
  image: BufferOrFileSchema,
  prompt: z.string().min(1, "Prompt cannot be empty"),
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  mask: BufferOrFileSchema,
  size: RecraftImageSizeSchema.optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
  negative_prompt: z.string().optional(),
});

/**
 * Post processing arguments schema
 */
export const PostProcessingArgsSchema = RecraftBaseArgsSchema.extend({
  image: BufferOrFileSchema,
  n: z
    .union([
      z.number().int().min(1).max(6),
      z.string().transform((n) => parseInt(n, 10)),
    ])
    .optional(),
  style_id: z.string().optional(),
  style: RecraftStyleV3Schema.optional(),
  substyle: RecraftSubstyleV3Schema.optional(),
});

// Type inference for TypeScript
export type RecraftBaseResponse = z.infer<typeof RecraftBaseResponseSchema>;
export type RecraftImageResponse = z.infer<typeof RecraftImageResponseSchema>;
export type RecraftImagesResponse = z.infer<typeof RecraftImagesResponseSchema>;
export type RecraftUserInfoResponse = z.infer<
  typeof RecraftUserInfoResponseSchema
>;
export type RecraftStyleResponse = z.infer<typeof RecraftStyleResponseSchema>;

export type RecraftColor = z.infer<typeof RecraftColorSchema>;
export type RecraftBoundingBox = z.infer<typeof RecraftBoundingBoxSchema>;
export type RecraftTextLayoutElement = z.infer<
  typeof RecraftTextLayoutElementSchema
>;
export type RecraftControls = z.infer<typeof RecraftControlsSchema>;
export type RecraftBaseArgs = z.infer<typeof RecraftBaseArgsSchema>;

// Use Zod's inferred types for our handlers
export type GenerateImageArgs = z.infer<typeof GenerateImageArgsSchema>;
export type ImageToImageArgs = z.infer<typeof ImageToImageArgsSchema>;
export type InpaintImageArgs = z.infer<typeof InpaintImageArgsSchema>;
export type ReplaceBackgroundArgs = z.infer<typeof ReplaceBackgroundArgsSchema>;
export type OutpaintImageArgs = z.infer<typeof OutpaintImageArgsSchema>;
export type PostProcessingArgs = z.infer<typeof PostProcessingArgsSchema>;
export type VectorizeImageArgs = z.infer<typeof VectorizeImageArgsSchema>;
export type RemoveBackgroundArgs = z.infer<typeof RemoveBackgroundArgsSchema>;
export type CrispUpscaleArgs = z.infer<typeof CrispUpscaleArgsSchema>;
export type CreativeUpscaleArgs = z.infer<typeof CreativeUpscaleArgsSchema>;
export type CreateStyleArgs = z.infer<typeof CreateStyleArgsSchema>;
export type SaveImageToDiskArgs = z.infer<typeof SaveImageToDiskArgsSchema>;
