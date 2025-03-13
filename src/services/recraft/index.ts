import { ENV } from "../../config/defaults.js";
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
  RecraftImagesResponse,
  RecraftImageResponse,
  RecraftStyleResponse,
  RecraftUserInfoResponse,
} from "../../types/recraft.js";

/**
 * Helper function to convert File or Buffer to Blob for FormData compatibility
 * @param {File | Buffer} value - The value to convert
 * @returns {Blob} - The value as a Blob
 */
const toBlob = (value: File | Buffer): Blob => {
  if (value instanceof Buffer) {
    return new Blob([value]);
  }
  return value as unknown as Blob;
};

/**
 * Recraft API facade class
 * @class RecraftApi
 * @description Combines all Recraft API operations into a single interface
 */
export class RecraftApi {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  /**
   * Creates a new Recraft API facade
   * @constructor
   * @description Initializes Recraft API client with configuration
   */
  constructor() {
    this.baseUrl = ENV.RECRAFT_API_URL;
    this.apiKey = ENV.RECRAFT_API_KEY;
  }

  /**
   * Generates an image based on the provided parameters
   * @param {GenerateImageArgs} args - The arguments for image generation
   * @returns {Promise<RecraftImagesResponse>} The generated images
   */
  async generateImage(args: GenerateImageArgs): Promise<RecraftImagesResponse> {
    const response = await fetch(`${this.baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to generate image: ${error}`);
    }

    return await response.json();
  }

  /**
   * Transforms an input image based on the provided parameters
   * @param {ImageToImageArgs} args - The arguments for image-to-image transformation
   * @returns {Promise<RecraftImagesResponse>} The transformed images
   */
  async imageToImage(args: ImageToImageArgs): Promise<RecraftImagesResponse> {
    const formData = new FormData();

    // Add all fields to form data
    for (const [key, value] of Object.entries(args)) {
      if (key === "image") {
        formData.append("image", toBlob(args.image));
      } else if (key !== "controls" && typeof value !== "undefined") {
        formData.append(key, value.toString());
      } else if (key === "controls" && value) {
        formData.append("controls", JSON.stringify(value));
      }
    }

    const response = await fetch(`${this.baseUrl}/v1/images/imageToImage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to transform image: ${error}`);
    }

    return await response.json();
  }

  /**
   * Inpaints an image based on the provided mask and parameters
   * @param {InpaintImageArgs} args - The arguments for image inpainting
   * @returns {Promise<RecraftImagesResponse>} The inpainted images
   */
  async inpaintImage(args: InpaintImageArgs): Promise<RecraftImagesResponse> {
    const formData = new FormData();

    // Add all fields to form data
    for (const [key, value] of Object.entries(args)) {
      if (key === "image" || key === "mask") {
        formData.append(key, toBlob(value as File | Buffer));
      } else if (typeof value !== "undefined") {
        formData.append(key, value.toString());
      }
    }

    const response = await fetch(`${this.baseUrl}/v1/images/inpaint`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to inpaint image: ${error}`);
    }

    return await response.json();
  }

  /**
   * Replaces the background of an image based on the provided parameters
   * @param {ReplaceBackgroundArgs} args - The arguments for background replacement
   * @returns {Promise<RecraftImagesResponse>} The images with replaced backgrounds
   */
  async replaceBackground(
    args: ReplaceBackgroundArgs
  ): Promise<RecraftImagesResponse> {
    const formData = new FormData();

    // Add all fields to form data
    for (const [key, value] of Object.entries(args)) {
      if (key === "image") {
        formData.append(key, toBlob(value as File | Buffer));
      } else if (typeof value !== "undefined") {
        formData.append(key, value.toString());
      }
    }

    const response = await fetch(
      `${this.baseUrl}/v1/images/replaceBackground`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to replace background: ${error}`);
    }

    return await response.json();
  }

  /**
   * Vectorizes an image
   * @param {VectorizeImageArgs} args - The arguments for image vectorization
   * @returns {Promise<RecraftImageResponse>} The vectorized image
   */
  async vectorizeImage(
    args: VectorizeImageArgs
  ): Promise<RecraftImageResponse> {
    const formData = new FormData();
    formData.append("file", toBlob(args.file));

    if (args.response_format) {
      formData.append("response_format", args.response_format);
    }

    const response = await fetch(`${this.baseUrl}/v1/images/vectorize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to vectorize image: ${error}`);
    }

    return await response.json();
  }

  /**
   * Removes the background from an image
   * @param {RemoveBackgroundArgs} args - The arguments for background removal
   * @returns {Promise<RecraftImageResponse>} The image with removed background
   */
  async removeBackground(
    args: RemoveBackgroundArgs
  ): Promise<RecraftImageResponse> {
    const formData = new FormData();
    formData.append("file", toBlob(args.file));

    if (args.response_format) {
      formData.append("response_format", args.response_format);
    }

    const response = await fetch(`${this.baseUrl}/v1/images/removeBackground`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to remove background: ${error}`);
    }

    return await response.json();
  }

  /**
   * Applies crisp upscale to an image
   * @param {CrispUpscaleArgs} args - The arguments for crisp upscale
   * @returns {Promise<RecraftImageResponse>} The upscaled image
   */
  async crispUpscale(args: CrispUpscaleArgs): Promise<RecraftImageResponse> {
    const formData = new FormData();
    formData.append("file", toBlob(args.file));

    if (args.response_format) {
      formData.append("response_format", args.response_format);
    }

    const response = await fetch(`${this.baseUrl}/v1/images/crispUpscale`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply crisp upscale: ${error}`);
    }

    return await response.json();
  }

  /**
   * Applies creative upscale to an image
   * @param {CreativeUpscaleArgs} args - The arguments for creative upscale
   * @returns {Promise<RecraftImageResponse>} The upscaled image
   */
  async creativeUpscale(
    args: CreativeUpscaleArgs
  ): Promise<RecraftImageResponse> {
    const formData = new FormData();
    formData.append("file", toBlob(args.file));

    if (args.response_format) {
      formData.append("response_format", args.response_format);
    }

    const response = await fetch(`${this.baseUrl}/v1/images/creativeUpscale`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply creative upscale: ${error}`);
    }

    return await response.json();
  }

  /**
   * Creates a style reference from uploaded images
   * @param {CreateStyleArgs} args - The arguments for style creation
   * @returns {Promise<RecraftStyleResponse>} The created style information
   */
  async createStyle(args: CreateStyleArgs): Promise<RecraftStyleResponse> {
    const formData = new FormData();
    formData.append("style", args.style);

    // Add files to form data
    args.files.forEach((file, index) => {
      formData.append(`file${index + 1}`, toBlob(file));
    });

    const response = await fetch(`${this.baseUrl}/v1/styles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create style: ${error}`);
    }

    return await response.json();
  }

  /**
   * Gets information about the current user
   * @returns {Promise<RecraftUserInfoResponse>} The user information
   */
  async getUserInfo(): Promise<RecraftUserInfoResponse> {
    const response = await fetch(`${this.baseUrl}/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user information: ${error}`);
    }

    return await response.json();
  }
}
