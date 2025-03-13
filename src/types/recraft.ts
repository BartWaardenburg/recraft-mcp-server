/**
 * @fileoverview Type definitions for Recraft API
 * This file contains TypeScript interfaces for the Recraft API
 */

import {
  RecraftStyleV3,
  RecraftSubstyleV3,
  RecraftImageSize,
} from "./recraft-styles.js";

/**
 * Base Response Type for Recraft API
 * @interface RecraftBaseResponse
 */
export interface RecraftBaseResponse {
  isError?: boolean;
  error?: string;
}

/**
 * Response with a single image
 * @interface RecraftImageResponse
 * @extends RecraftBaseResponse
 */
export interface RecraftImageResponse extends RecraftBaseResponse {
  image: {
    url: string;
    b64_json?: string;
  };
}

/**
 * Response with multiple images
 * @interface RecraftImagesResponse
 * @extends RecraftBaseResponse
 */
export interface RecraftImagesResponse extends RecraftBaseResponse {
  data: Array<{
    url: string;
    b64_json?: string;
  }>;
}

/**
 * Response for style creation
 * @interface RecraftStyleResponse
 * @extends RecraftBaseResponse
 */
export interface RecraftStyleResponse extends RecraftBaseResponse {
  id: string;
}

/**
 * User information response
 * @interface RecraftUserInfoResponse
 * @extends RecraftBaseResponse
 */
export interface RecraftUserInfoResponse extends RecraftBaseResponse {
  id: string;
  name: string;
  email: string;
  credits: number;
}

/**
 * Color type for Recraft API
 * @interface RecraftColor
 */
export interface RecraftColor {
  rgb: [number, number, number]; // RGB values range [0-255]
}

/**
 * Text layout bounding box
 * @type RecraftBoundingBox
 */
export type RecraftBoundingBox = [
  [number, number],
  [number, number],
  [number, number],
  [number, number]
];

/**
 * Text layout element
 * @interface RecraftTextLayoutElement
 */
export interface RecraftTextLayoutElement {
  text: string;
  bbox: RecraftBoundingBox;
}

/**
 * Control parameters for generation
 * @interface RecraftControls
 */
export interface RecraftControls {
  artistic_level?: number; // Range 0-5
  colors?: RecraftColor[];
  background_color?: RecraftColor;
  no_text?: boolean;
}

/**
 * Base arguments for all image operations
 * @interface RecraftBaseArgs
 */
export interface RecraftBaseArgs {
  model?: "recraftv2" | "recraftv3";
  response_format?: "url" | "b64_json";
}

/**
 * Arguments for image generation
 * @interface GenerateImageArgs
 * @extends RecraftBaseArgs
 */
export interface GenerateImageArgs extends RecraftBaseArgs {
  prompt: string;
  n?: number;
  style_id?: string;
  style?: RecraftStyleV3;
  substyle?: RecraftSubstyleV3;
  size?: RecraftImageSize;
  negative_prompt?: string;
  controls?: RecraftControls;
  text_layout?: RecraftTextLayoutElement[];
}

/**
 * Arguments for image-to-image operations
 * @interface ImageToImageArgs
 * @extends RecraftBaseArgs
 */
export interface ImageToImageArgs extends RecraftBaseArgs {
  image: File | Buffer;
  prompt: string;
  strength: number;
  n?: number;
  style_id?: string;
  style?: RecraftStyleV3;
  substyle?: RecraftSubstyleV3;
  negative_prompt?: string;
  controls?: RecraftControls;
}

/**
 * Arguments for image inpainting
 * @interface InpaintImageArgs
 * @extends RecraftBaseArgs
 */
export interface InpaintImageArgs extends RecraftBaseArgs {
  image: File | Buffer;
  mask: File | Buffer;
  prompt: string;
  n?: number;
  style_id?: string;
  style?: RecraftStyleV3;
  substyle?: RecraftSubstyleV3;
  negative_prompt?: string;
}

/**
 * Arguments for replacing image background
 * @interface ReplaceBackgroundArgs
 * @extends RecraftBaseArgs
 */
export interface ReplaceBackgroundArgs extends RecraftBaseArgs {
  image: File | Buffer;
  prompt: string;
  n?: number;
  style_id?: string;
  style?: RecraftStyleV3;
  substyle?: RecraftSubstyleV3;
  negative_prompt?: string;
}

/**
 * Arguments for vectorizing an image
 * @interface VectorizeImageArgs
 * @extends RecraftBaseArgs
 */
export interface VectorizeImageArgs extends RecraftBaseArgs {
  file: File | Buffer;
}

/**
 * Arguments for removing image background
 * @interface RemoveBackgroundArgs
 * @extends RecraftBaseArgs
 */
export interface RemoveBackgroundArgs extends RecraftBaseArgs {
  file: File | Buffer;
}

/**
 * Arguments for crisp upscale operation
 * @interface CrispUpscaleArgs
 * @extends RecraftBaseArgs
 */
export interface CrispUpscaleArgs extends RecraftBaseArgs {
  file: File | Buffer;
}

/**
 * Arguments for creative upscale operation
 * @interface CreativeUpscaleArgs
 * @extends RecraftBaseArgs
 */
export interface CreativeUpscaleArgs extends RecraftBaseArgs {
  file: File | Buffer;
}

/**
 * Arguments for creating a style
 * @interface CreateStyleArgs
 */
export interface CreateStyleArgs {
  style: string;
  files: Array<File | Buffer>;
}

/**
 * Arguments for saving an image to disk
 * @interface SaveImageToDiskArgs
 */
export interface SaveImageToDiskArgs {
  image_url?: string;
  image_b64?: string;
  output_path: string;
  filename: string;
}
