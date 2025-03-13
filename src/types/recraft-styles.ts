/**
 * @fileoverview Type definitions for Recraft V3 styles and substyles
 * This file contains TypeScript type definitions for all available styles, substyles, and image sizes
 * in the Recraft API V3
 */

/**
 * Available Recraft V3 styles
 */
export type RecraftStyleV3 =
  | "any"
  | "realistic_image"
  | "digital_illustration"
  | "vector_illustration"
  | "icon"
  | "logo_raster";

/**
 * Available Recraft V3 substyles for 'realistic_image' style
 */
export type RealisticImageSubstyleV3 =
  | "b_and_w"
  | "enterprise"
  | "evening_light"
  | "faded_nostalgia"
  | "forest_life"
  | "hard_flash"
  | "hdr"
  | "motion_blur"
  | "mystic_naturalism"
  | "natural_light"
  | "natural_tones"
  | "organic_calm"
  | "real_life_glow"
  | "retro_realism"
  | "retro_snapshot"
  | "studio_portrait"
  | "urban_drama"
  | "village_realism"
  | "warm_folk";

/**
 * Available Recraft V3 substyles for 'digital_illustration' style
 */
export type DigitalIllustrationSubstyleV3 =
  | "2d_art_poster"
  | "2d_art_poster_2"
  | "antiquarian"
  | "bold_fantasy"
  | "child_book"
  | "child_books"
  | "cover"
  | "crosshatch"
  | "digital_engraving"
  | "engraving_color"
  | "expressionism"
  | "freehand_details"
  | "grain"
  | "grain_20"
  | "graphic_intensity"
  | "hand_drawn"
  | "hand_drawn_outline"
  | "handmade_3d"
  | "hard_comics"
  | "infantile_sketch"
  | "long_shadow"
  | "modern_folk"
  | "multicolor"
  | "neon_calm"
  | "noir"
  | "nostalgic_pastel"
  | "outline_details"
  | "pastel_gradient"
  | "pastel_sketch"
  | "pixel_art"
  | "plastic"
  | "pop_art"
  | "pop_renaissance"
  | "seamless"
  | "street_art"
  | "tablet_sketch"
  | "urban_glow"
  | "urban_sketching"
  | "vanilla_dreams"
  | "young_adult_book"
  | "young_adult_book_2";

/**
 * Available Recraft V3 substyles for 'vector_illustration' style
 */
export type VectorIllustrationSubstyleV3 =
  | "bold_stroke"
  | "chemistry"
  | "colored_stencil"
  | "contour_pop_art"
  | "cosmics"
  | "cutout"
  | "depressive"
  | "editorial"
  | "emotional_flat"
  | "engraving"
  | "infographical"
  | "line_art"
  | "line_circuit"
  | "linocut"
  | "marker_outline"
  | "mosaic"
  | "naivector"
  | "roundish_flat"
  | "seamless"
  | "segmented_colors"
  | "sharp_contrast"
  | "thin"
  | "vector_photo"
  | "vivid_shapes";

/**
 * Available Recraft V3 substyles for 'logo_raster' style
 */
export type LogoRasterSubstyleV3 =
  | "emblem_graffiti"
  | "emblem_pop_art"
  | "emblem_punk"
  | "emblem_stamp"
  | "emblem_vintage";

/**
 * Available Recraft V2 substyles for 'realistic_image' style
 */
export type RealisticImageSubstyleV2 =
  | "b_and_w"
  | "enterprise"
  | "hard_flash"
  | "hdr"
  | "motion_blur"
  | "natural_light"
  | "studio_portrait";

/**
 * Available Recraft V2 substyles for 'digital_illustration' style
 */
export type DigitalIllustrationSubstyleV2 =
  | "2d_art_poster"
  | "2d_art_poster_2"
  | "3d"
  | "80s"
  | "engraving_color"
  | "glow"
  | "grain"
  | "hand_drawn"
  | "hand_drawn_outline"
  | "handmade_3d"
  | "infantile_sketch"
  | "kawaii"
  | "pixel_art"
  | "plastic"
  | "psychedelic"
  | "seamless"
  | "voxel"
  | "watercolor";

/**
 * Available Recraft V2 substyles for 'vector_illustration' style
 */
export type VectorIllustrationSubstyleV2 =
  | "cartoon"
  | "doodle_line_art"
  | "engraving"
  | "flat_2"
  | "kawaii"
  | "line_art"
  | "line_circuit"
  | "linocut"
  | "seamless";

/**
 * Available Recraft V2 substyles for 'icon' style
 */
export type IconSubstyleV2 =
  | "broken_line"
  | "colored_outline"
  | "colored_shapes"
  | "colored_shapes_gradient"
  | "doodle_fill"
  | "doodle_offset_fill"
  | "offset_fill"
  | "outline"
  | "outline_gradient"
  | "uneven_fill";

/**
 * Union type of all possible substyles for Recraft V3
 */
export type RecraftSubstyleV3 =
  | RealisticImageSubstyleV3
  | DigitalIllustrationSubstyleV3
  | VectorIllustrationSubstyleV3
  | LogoRasterSubstyleV3;

/**
 * Union type of all possible substyles for Recraft V2
 */
export type RecraftSubstyleV2 =
  | RealisticImageSubstyleV2
  | DigitalIllustrationSubstyleV2
  | VectorIllustrationSubstyleV2
  | IconSubstyleV2;

/**
 * Map of style to available substyles for Recraft V3
 */
export type RecraftV3StyleToSubstyleMap = {
  any: never;
  realistic_image: RealisticImageSubstyleV3;
  digital_illustration: DigitalIllustrationSubstyleV3;
  vector_illustration: VectorIllustrationSubstyleV3;
  icon: never;
  logo_raster: LogoRasterSubstyleV3;
};

/**
 * Map of style to available substyles for Recraft V2
 */
export type RecraftV2StyleToSubstyleMap = {
  any: never;
  realistic_image: RealisticImageSubstyleV2;
  digital_illustration: DigitalIllustrationSubstyleV2;
  vector_illustration: VectorIllustrationSubstyleV2;
  icon: IconSubstyleV2;
  logo_raster: never;
};

/**
 * Available image sizes for Recraft API
 */
export type RecraftImageSize =
  | "1024x1024"
  | "1365x1024"
  | "1024x1365"
  | "1536x1024"
  | "1024x1536"
  | "1820x1024"
  | "1024x1820"
  | "1024x2048"
  | "2048x1024"
  | "1434x1024"
  | "1024x1434"
  | "1024x1280"
  | "1280x1024"
  | "1024x1707"
  | "1707x1024";

/**
 * Type guard to check if a string is a valid Recraft V3 style
 */
export const isValidRecraftStyleV3 = (
  style: string
): style is RecraftStyleV3 => {
  return [
    "any",
    "realistic_image",
    "digital_illustration",
    "vector_illustration",
    "icon",
    "logo_raster",
  ].includes(style);
};

/**
 * Type guard to check if a string is a valid Recraft V3 substyle for the given style
 */
export const isValidRecraftSubstyleV3 = (
  style: RecraftStyleV3,
  substyle: string
): boolean => {
  switch (style) {
    case "realistic_image":
      return isRealisticImageSubstyleV3(substyle);
    case "digital_illustration":
      return isDigitalIllustrationSubstyleV3(substyle);
    case "vector_illustration":
      return isVectorIllustrationSubstyleV3(substyle);
    case "logo_raster":
      return isLogoRasterSubstyleV3(substyle);
    default:
      return false;
  }
};

/**
 * Type guards for specific style substyles
 */
export const isRealisticImageSubstyleV3 = (
  substyle: string
): substyle is RealisticImageSubstyleV3 => {
  return [
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
  ].includes(substyle);
};

export const isDigitalIllustrationSubstyleV3 = (
  substyle: string
): substyle is DigitalIllustrationSubstyleV3 => {
  return [
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
  ].includes(substyle);
};

export const isVectorIllustrationSubstyleV3 = (
  substyle: string
): substyle is VectorIllustrationSubstyleV3 => {
  return [
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
  ].includes(substyle);
};

export const isLogoRasterSubstyleV3 = (
  substyle: string
): substyle is LogoRasterSubstyleV3 => {
  return [
    "emblem_graffiti",
    "emblem_pop_art",
    "emblem_punk",
    "emblem_stamp",
    "emblem_vintage",
  ].includes(substyle);
};

/**
 * Type guard to check if a string is a valid image size
 */
export const isValidImageSize = (size: string): size is RecraftImageSize => {
  return [
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
  ].includes(size);
};
