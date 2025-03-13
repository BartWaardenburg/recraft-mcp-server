/**
 * Tool definitions for the MCP server
 * @description Defines all available tools and their input schemas for the MCP server
 * @module toolDefinitions
 */
export const toolDefinitions = {
  /**
   * Generate an image from a text prompt
   */
  generate_image: {
    description: "Generate an image from a text prompt",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Text description of desired image",
        },
        n: {
          type: "integer",
          description: "Number of images to generate (1-6)",
        },
        style_id: {
          type: "string",
          description: "Style ID to use as reference",
        },
        style: {
          type: "string",
          description:
            "Style of the generated image (any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster)",
          enum: [
            "any",
            "realistic_image",
            "digital_illustration",
            "vector_illustration",
            "icon",
            "logo_raster",
          ],
        },
        substyle: {
          type: "string",
          description:
            "Substyle of the generated image. Valid substyles depend on the selected style:\n" +
            "- realistic_image: b_and_w, enterprise, evening_light, faded_nostalgia, forest_life, hard_flash, hdr, motion_blur, mystic_naturalism, natural_light, natural_tones, organic_calm, real_life_glow, retro_realism, retro_snapshot, studio_portrait, urban_drama, village_realism, warm_folk\n" +
            "- digital_illustration: 2d_art_poster, 2d_art_poster_2, antiquarian, bold_fantasy, child_book, child_books, cover, crosshatch, digital_engraving, engraving_color, expressionism, freehand_details, grain, grain_20, graphic_intensity, hand_drawn, hand_drawn_outline, handmade_3d, hard_comics, infantile_sketch, long_shadow, modern_folk, multicolor, neon_calm, noir, nostalgic_pastel, outline_details, pastel_gradient, pastel_sketch, pixel_art, plastic, pop_art, pop_renaissance, seamless, street_art, tablet_sketch, urban_glow, urban_sketching, vanilla_dreams, young_adult_book, young_adult_book_2\n" +
            "- vector_illustration: bold_stroke, chemistry, colored_stencil, contour_pop_art, cosmics, cutout, depressive, editorial, emotional_flat, engraving, infographical, line_art, line_circuit, linocut, marker_outline, mosaic, naivector, roundish_flat, seamless, segmented_colors, sharp_contrast, thin, vector_photo, vivid_shapes\n" +
            "- logo_raster: emblem_graffiti, emblem_pop_art, emblem_punk, emblem_stamp, emblem_vintage",
        },
        size: {
          type: "string",
          description: "Size of the generated image",
          enum: [
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
          ],
        },
        model: {
          type: "string",
          description: "Model to use for generation (recraftv2 or recraftv3)",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
        negative_prompt: {
          type: "string",
          description: "Elements to avoid in the image",
        },
      },
      required: ["prompt"],
    },
  },

  /**
   * Transform an existing image based on a text prompt
   */
  image_to_image: {
    description: "Transform an existing image based on a text prompt",
    inputSchema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        prompt: {
          type: "string",
          description: "Text description of desired changes",
        },
        strength: {
          type: "number",
          description: "How much to transform the image (0.0-1.0)",
        },
        n: {
          type: "integer",
          description: "Number of images to generate (1-6)",
        },
        style_id: {
          type: "string",
          description: "Style ID to use as reference",
        },
        style: {
          type: "string",
          description:
            "Style of the generated image (any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster)",
          enum: [
            "any",
            "realistic_image",
            "digital_illustration",
            "vector_illustration",
            "icon",
            "logo_raster",
          ],
        },
        substyle: {
          type: "string",
          description:
            "Substyle of the generated image. Valid substyles depend on the selected style:\n" +
            "- realistic_image: b_and_w, enterprise, evening_light, faded_nostalgia, forest_life, hard_flash, hdr, motion_blur, mystic_naturalism, natural_light, natural_tones, organic_calm, real_life_glow, retro_realism, retro_snapshot, studio_portrait, urban_drama, village_realism, warm_folk\n" +
            "- digital_illustration: 2d_art_poster, 2d_art_poster_2, antiquarian, bold_fantasy, child_book, child_books, cover, crosshatch, digital_engraving, engraving_color, expressionism, freehand_details, grain, grain_20, graphic_intensity, hand_drawn, hand_drawn_outline, handmade_3d, hard_comics, infantile_sketch, long_shadow, modern_folk, multicolor, neon_calm, noir, nostalgic_pastel, outline_details, pastel_gradient, pastel_sketch, pixel_art, plastic, pop_art, pop_renaissance, seamless, street_art, tablet_sketch, urban_glow, urban_sketching, vanilla_dreams, young_adult_book, young_adult_book_2\n" +
            "- vector_illustration: bold_stroke, chemistry, colored_stencil, contour_pop_art, cosmics, cutout, depressive, editorial, emotional_flat, engraving, infographical, line_art, line_circuit, linocut, marker_outline, mosaic, naivector, roundish_flat, seamless, segmented_colors, sharp_contrast, thin, vector_photo, vivid_shapes\n" +
            "- logo_raster: emblem_graffiti, emblem_pop_art, emblem_punk, emblem_stamp, emblem_vintage",
        },
        model: {
          type: "string",
          description: "Model to use for generation (recraftv2 or recraftv3)",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
        negative_prompt: {
          type: "string",
          description: "Elements to avoid in the image",
        },
      },
      required: ["image", "prompt", "strength"],
    },
  },

  /**
   * Inpaint (edit) parts of an image using a mask
   */
  inpaint_image: {
    description: "Inpaint (edit) parts of an image using a mask",
    inputSchema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        mask: {
          type: "string",
          description: "Base64-encoded mask image data or file path",
        },
        prompt: {
          type: "string",
          description: "Text description for the inpainted area",
        },
        n: {
          type: "integer",
          description: "Number of images to generate (1-6)",
        },
        style_id: {
          type: "string",
          description: "Style ID to use as reference",
        },
        style: {
          type: "string",
          description:
            "Style of the generated image (any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster)",
          enum: [
            "any",
            "realistic_image",
            "digital_illustration",
            "vector_illustration",
            "icon",
            "logo_raster",
          ],
        },
        substyle: {
          type: "string",
          description:
            "Substyle of the generated image. Valid substyles depend on the selected style:\n" +
            "- realistic_image: b_and_w, enterprise, evening_light, faded_nostalgia, forest_life, hard_flash, hdr, motion_blur, mystic_naturalism, natural_light, natural_tones, organic_calm, real_life_glow, retro_realism, retro_snapshot, studio_portrait, urban_drama, village_realism, warm_folk\n" +
            "- digital_illustration: 2d_art_poster, 2d_art_poster_2, antiquarian, bold_fantasy, child_book, child_books, cover, crosshatch, digital_engraving, engraving_color, expressionism, freehand_details, grain, grain_20, graphic_intensity, hand_drawn, hand_drawn_outline, handmade_3d, hard_comics, infantile_sketch, long_shadow, modern_folk, multicolor, neon_calm, noir, nostalgic_pastel, outline_details, pastel_gradient, pastel_sketch, pixel_art, plastic, pop_art, pop_renaissance, seamless, street_art, tablet_sketch, urban_glow, urban_sketching, vanilla_dreams, young_adult_book, young_adult_book_2\n" +
            "- vector_illustration: bold_stroke, chemistry, colored_stencil, contour_pop_art, cosmics, cutout, depressive, editorial, emotional_flat, engraving, infographical, line_art, line_circuit, linocut, marker_outline, mosaic, naivector, roundish_flat, seamless, segmented_colors, sharp_contrast, thin, vector_photo, vivid_shapes\n" +
            "- logo_raster: emblem_graffiti, emblem_pop_art, emblem_punk, emblem_stamp, emblem_vintage",
        },
        model: {
          type: "string",
          description: "Model to use for generation (recraftv2 or recraftv3)",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
        negative_prompt: {
          type: "string",
          description: "Elements to avoid in the image",
        },
      },
      required: ["image", "mask", "prompt"],
    },
  },

  /**
   * Replace the background of an image
   */
  replace_background: {
    description: "Replace the background of an image",
    inputSchema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        prompt: {
          type: "string",
          description: "Text description of desired background",
        },
        n: {
          type: "integer",
          description: "Number of images to generate (1-6)",
        },
        style_id: {
          type: "string",
          description: "Style ID to use as reference",
        },
        style: {
          type: "string",
          description:
            "Style of the generated image (any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster)",
          enum: [
            "any",
            "realistic_image",
            "digital_illustration",
            "vector_illustration",
            "icon",
            "logo_raster",
          ],
        },
        substyle: {
          type: "string",
          description:
            "Substyle of the generated image. Valid substyles depend on the selected style:\n" +
            "- realistic_image: b_and_w, enterprise, evening_light, faded_nostalgia, forest_life, hard_flash, hdr, motion_blur, mystic_naturalism, natural_light, natural_tones, organic_calm, real_life_glow, retro_realism, retro_snapshot, studio_portrait, urban_drama, village_realism, warm_folk\n" +
            "- digital_illustration: 2d_art_poster, 2d_art_poster_2, antiquarian, bold_fantasy, child_book, child_books, cover, crosshatch, digital_engraving, engraving_color, expressionism, freehand_details, grain, grain_20, graphic_intensity, hand_drawn, hand_drawn_outline, handmade_3d, hard_comics, infantile_sketch, long_shadow, modern_folk, multicolor, neon_calm, noir, nostalgic_pastel, outline_details, pastel_gradient, pastel_sketch, pixel_art, plastic, pop_art, pop_renaissance, seamless, street_art, tablet_sketch, urban_glow, urban_sketching, vanilla_dreams, young_adult_book, young_adult_book_2\n" +
            "- vector_illustration: bold_stroke, chemistry, colored_stencil, contour_pop_art, cosmics, cutout, depressive, editorial, emotional_flat, engraving, infographical, line_art, line_circuit, linocut, marker_outline, mosaic, naivector, roundish_flat, seamless, segmented_colors, sharp_contrast, thin, vector_photo, vivid_shapes\n" +
            "- logo_raster: emblem_graffiti, emblem_pop_art, emblem_punk, emblem_stamp, emblem_vintage",
        },
        model: {
          type: "string",
          description: "Model to use for generation (recraftv2 or recraftv3)",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
        negative_prompt: {
          type: "string",
          description: "Elements to avoid in the image",
        },
      },
      required: ["image", "prompt"],
    },
  },

  /**
   * Vectorize an image to SVG format
   */
  vectorize_image: {
    description: "Vectorize an image to SVG format",
    inputSchema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
      },
      required: ["file"],
    },
  },

  /**
   * Remove the background from an image
   */
  remove_background: {
    description: "Remove the background from an image",
    inputSchema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
      },
      required: ["file"],
    },
  },

  /**
   * Enhance image resolution with crisp upscale
   */
  crisp_upscale: {
    description: "Enhance image resolution with crisp upscale",
    inputSchema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
      },
      required: ["file"],
    },
  },

  /**
   * Enhance image with creative upscale for improved details
   */
  creative_upscale: {
    description: "Enhance image with creative upscale for improved details",
    inputSchema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          description: "Base64-encoded image data or file path",
        },
        response_format: {
          type: "string",
          description: "Format for the response (url or b64_json)",
        },
      },
      required: ["file"],
    },
  },

  /**
   * Create a style by uploading reference images
   */
  create_style: {
    description: "Create a style by uploading reference images",
    inputSchema: {
      type: "object",
      properties: {
        style: {
          type: "string",
          description: "Base style to use",
        },
        files: {
          type: "array",
          description: "Array of Base64-encoded images or file paths",
          items: {
            type: "string",
          },
        },
      },
      required: ["style", "files"],
    },
  },

  /**
   * Get current user information
   */
  get_user_info: {
    description: "Get information about the current user",
    inputSchema: {
      type: "object",
      properties: {
        dummy: {
          type: "string",
          description: "Dummy parameter (not used)",
        },
      },
      required: [],
    },
  },

  /**
   * Save an image to disk
   */
  save_image_to_disk: {
    description: "Save an image response to disk in a specified folder",
    inputSchema: {
      type: "object",
      properties: {
        image_url: {
          type: "string",
          description: "URL of the image to save",
        },
        image_b64: {
          type: "string",
          description: "Base64 encoded image data (alternative to image_url)",
        },
        output_path: {
          type: "string",
          description: "Path to the folder where the image should be saved",
        },
        filename: {
          type: "string",
          description: "Name of the file to save (without extension)",
        },
      },
      required: ["output_path", "filename"],
      oneOf: [{ required: ["image_url"] }, { required: ["image_b64"] }],
    },
  },
} as const;
