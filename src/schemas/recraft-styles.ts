/**
 * @fileoverview Zod schemas for Recraft V3 styles and substyles
 * This file contains Zod schemas for validating style and substyle options
 */

import { z } from "zod";

/**
 * Schema for Recraft V3 styles
 */
export const RecraftStyleV3Schema = z.enum([
  "any",
  "realistic_image",
  "digital_illustration",
  "vector_illustration",
  "icon",
  "logo_raster",
]);

/**
 * Schema for Recraft V3 substyles for 'realistic_image' style
 */
export const RealisticImageSubstyleV3Schema = z.enum([
  "b_and_w",
  "enterprise",
  "evening_light",
  "faded_nostalgia",
  "forest_life",
  "hard_flash",
  "hdr",
  "motion_blur",
  "mystic_naturalism",
  "natural_light",
  "natural_tones",
  "organic_calm",
  "real_life_glow",
  "retro_realism",
  "retro_snapshot",
  "studio_portrait",
  "urban_drama",
  "village_realism",
  "warm_folk",
]);

/**
 * Schema for Recraft V3 substyles for 'digital_illustration' style
 */
export const DigitalIllustrationSubstyleV3Schema = z.enum([
  "2d_art_poster",
  "2d_art_poster_2",
  "antiquarian",
  "bold_fantasy",
  "child_book",
  "child_books",
  "cover",
  "crosshatch",
  "digital_engraving",
  "engraving_color",
  "expressionism",
  "freehand_details",
  "grain",
  "grain_20",
  "graphic_intensity",
  "hand_drawn",
  "hand_drawn_outline",
  "handmade_3d",
  "hard_comics",
  "infantile_sketch",
  "long_shadow",
  "modern_folk",
  "multicolor",
  "neon_calm",
  "noir",
  "nostalgic_pastel",
  "outline_details",
  "pastel_gradient",
  "pastel_sketch",
  "pixel_art",
  "plastic",
  "pop_art",
  "pop_renaissance",
  "seamless",
  "street_art",
  "tablet_sketch",
  "urban_glow",
  "urban_sketching",
  "vanilla_dreams",
  "young_adult_book",
  "young_adult_book_2",
]);

/**
 * Schema for Recraft V3 substyles for 'vector_illustration' style
 */
export const VectorIllustrationSubstyleV3Schema = z.enum([
  "bold_stroke",
  "chemistry",
  "colored_stencil",
  "contour_pop_art",
  "cosmics",
  "cutout",
  "depressive",
  "editorial",
  "emotional_flat",
  "engraving",
  "infographical",
  "line_art",
  "line_circuit",
  "linocut",
  "marker_outline",
  "mosaic",
  "naivector",
  "roundish_flat",
  "seamless",
  "segmented_colors",
  "sharp_contrast",
  "thin",
  "vector_photo",
  "vivid_shapes",
]);

/**
 * Schema for Recraft V3 substyles for 'logo_raster' style
 */
export const LogoRasterSubstyleV3Schema = z.enum([
  "emblem_graffiti",
  "emblem_pop_art",
  "emblem_punk",
  "emblem_stamp",
  "emblem_vintage",
]);

/**
 * Schema for Recraft V2 substyles for 'realistic_image' style
 */
export const RealisticImageSubstyleV2Schema = z.enum([
  "b_and_w",
  "enterprise",
  "hard_flash",
  "hdr",
  "motion_blur",
  "natural_light",
  "studio_portrait",
]);

/**
 * Schema for Recraft V2 substyles for 'digital_illustration' style
 */
export const DigitalIllustrationSubstyleV2Schema = z.enum([
  "2d_art_poster",
  "2d_art_poster_2",
  "3d",
  "80s",
  "engraving_color",
  "glow",
  "grain",
  "hand_drawn",
  "hand_drawn_outline",
  "handmade_3d",
  "infantile_sketch",
  "kawaii",
  "pixel_art",
  "plastic",
  "psychedelic",
  "seamless",
  "voxel",
  "watercolor",
]);

/**
 * Schema for Recraft V2 substyles for 'vector_illustration' style
 */
export const VectorIllustrationSubstyleV2Schema = z.enum([
  "cartoon",
  "doodle_line_art",
  "engraving",
  "flat_2",
  "kawaii",
  "line_art",
  "line_circuit",
  "linocut",
  "seamless",
]);

/**
 * Schema for Recraft V2 substyles for 'icon' style
 */
export const IconSubstyleV2Schema = z.enum([
  "broken_line",
  "colored_outline",
  "colored_shapes",
  "colored_shapes_gradient",
  "doodle_fill",
  "doodle_offset_fill",
  "offset_fill",
  "outline",
  "outline_gradient",
  "uneven_fill",
]);

/**
 * Union schema of all possible substyles for Recraft V3
 */
export const RecraftSubstyleV3Schema = z.union([
  RealisticImageSubstyleV3Schema,
  DigitalIllustrationSubstyleV3Schema,
  VectorIllustrationSubstyleV3Schema,
  LogoRasterSubstyleV3Schema,
]);

/**
 * Union schema of all possible substyles for Recraft V2
 */
export const RecraftSubstyleV2Schema = z.union([
  RealisticImageSubstyleV2Schema,
  DigitalIllustrationSubstyleV2Schema,
  VectorIllustrationSubstyleV2Schema,
  IconSubstyleV2Schema,
]);

/**
 * Schema for valid image sizes for Recraft API
 */
export const RecraftImageSizeSchema = z.enum([
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

// Type inference for TypeScript
export type RecraftStyleV3 = z.infer<typeof RecraftStyleV3Schema>;
export type RealisticImageSubstyleV3 = z.infer<
  typeof RealisticImageSubstyleV3Schema
>;
export type DigitalIllustrationSubstyleV3 = z.infer<
  typeof DigitalIllustrationSubstyleV3Schema
>;
export type VectorIllustrationSubstyleV3 = z.infer<
  typeof VectorIllustrationSubstyleV3Schema
>;
export type LogoRasterSubstyleV3 = z.infer<typeof LogoRasterSubstyleV3Schema>;
export type RecraftSubstyleV3 = z.infer<typeof RecraftSubstyleV3Schema>;
export type RealisticImageSubstyleV2 = z.infer<
  typeof RealisticImageSubstyleV2Schema
>;
export type DigitalIllustrationSubstyleV2 = z.infer<
  typeof DigitalIllustrationSubstyleV2Schema
>;
export type VectorIllustrationSubstyleV2 = z.infer<
  typeof VectorIllustrationSubstyleV2Schema
>;
export type IconSubstyleV2 = z.infer<typeof IconSubstyleV2Schema>;
export type RecraftSubstyleV2 = z.infer<typeof RecraftSubstyleV2Schema>;
export type RecraftImageSize = z.infer<typeof RecraftImageSizeSchema>;
