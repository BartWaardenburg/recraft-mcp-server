// --- Image Generation ---

export type ImageStyle =
  | "realistic_image"
  | "digital_illustration"
  | "vector_illustration"
  | "icon"
  | "logo_raster";

export type ImageSubStyle =
  | "b_and_w"
  | "enterprise"
  | "hdr"
  | "natural_light"
  | "studio_portrait"
  | "hard_flash"
  | "motion_blur"
  | "evening_light"
  | "hand_drawn"
  | "pixel_art"
  | "grain"
  | "kawaii"
  | "watercolor"
  | "pop_art"
  | "noir"
  | "bold_stroke"
  | "chemistry"
  | "cutout"
  | "editorial"
  | "mosaic"
  | "emblem_graffiti"
  | "emblem_pop_art"
  | "emblem_punk"
  | "emblem_stamp"
  | "emblem_vintage";

export type RecraftModel =
  | "recraftv4"
  | "recraftv4_vector"
  | "recraftv3"
  | "recraftv2"
  | "recraft20b"
  | "refm1";

export type ImageSize =
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

export type ResponseFormat = "url" | "b64_json";
export type ImageFormat = "webp" | "png";

export interface ColorWeight {
  rgb: [number, number, number];
  weight?: number;
}

export interface BackgroundColor {
  rgb: [number, number, number];
}

export interface Controls {
  artistic_level?: number;
  colors?: ColorWeight[];
  background_color?: BackgroundColor;
  no_text?: boolean;
}

export interface TextLayoutItem {
  text: string;
  bbox: [[number, number], [number, number], [number, number], [number, number]];
}

// --- Request Parameters ---

export interface GenerateImageParams {
  prompt: string;
  model?: RecraftModel;
  style?: ImageStyle;
  substyle?: ImageSubStyle;
  style_id?: string;
  size?: ImageSize;
  n?: number;
  response_format?: ResponseFormat;
  negative_prompt?: string;
  controls?: Controls;
  text_layout?: TextLayoutItem[];
  image_format?: ImageFormat;
  random_seed?: number;
}

export interface ImageToImageParams {
  image: string;
  prompt: string;
  strength: number;
  model?: RecraftModel;
  style?: ImageStyle;
  substyle?: ImageSubStyle;
  style_id?: string;
  n?: number;
  response_format?: ResponseFormat;
  negative_prompt?: string;
  controls?: Controls;
  image_format?: ImageFormat;
  random_seed?: number;
}

export interface InpaintParams {
  image: string;
  mask: string;
  prompt: string;
  model?: RecraftModel;
  style?: ImageStyle;
  substyle?: ImageSubStyle;
  style_id?: string;
  n?: number;
  response_format?: ResponseFormat;
  negative_prompt?: string;
  controls?: Controls;
  image_format?: ImageFormat;
  random_seed?: number;
}

export interface ReplaceBackgroundParams {
  image: string;
  prompt: string;
  model?: RecraftModel;
  style?: ImageStyle;
  substyle?: ImageSubStyle;
  style_id?: string;
  n?: number;
  response_format?: ResponseFormat;
  negative_prompt?: string;
  image_format?: ImageFormat;
  random_seed?: number;
}

export interface GenerateBackgroundParams {
  image: string;
  mask: string;
  prompt: string;
  model?: RecraftModel;
  style?: ImageStyle;
  substyle?: ImageSubStyle;
  style_id?: string;
  n?: number;
  response_format?: ResponseFormat;
  negative_prompt?: string;
  image_format?: ImageFormat;
  random_seed?: number;
}

export interface ProcessImageParams {
  image: string;
  response_format?: ResponseFormat;
  image_format?: ImageFormat;
}

export interface EraseRegionParams {
  image: string;
  mask: string;
  response_format?: ResponseFormat;
  image_format?: ImageFormat;
}

export interface CreateStyleParams {
  images: string[];
  style: ImageStyle;
}

// --- Response Types ---

export interface GeneratedImage {
  image_id: string;
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
}

export interface GenerateImageResponse {
  created: number;
  credits: number;
  data: GeneratedImage[];
}

export interface ProcessedImage {
  image_id: string;
  url?: string;
  b64_json?: string;
}

export interface ProcessImageResponse {
  created: number;
  credits: number;
  image: ProcessedImage;
}

export interface StyleResponse {
  id: string;
  model?: string;
  style?: string;
  substyle?: string;
}

export interface StyleListResponse {
  styles: StyleResponse[];
}

export interface UserResponse {
  id: string;
  credits: number;
  email: string;
  name: string;
}
