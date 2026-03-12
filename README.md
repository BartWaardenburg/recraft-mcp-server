# recraft-mcp

MCP server for AI image generation, transformation, and style management via the [Recraft API](https://www.recraft.ai/api).

## Features

- **Image Generation** — Text-to-image, image-to-image, inpainting, background replacement & generation
- **Image Processing** — Background removal, region erasing, vectorization (SVG), crisp & creative upscaling
- **Style Management** — Create custom styles from reference images, list/get/delete styles
- **User Info** — Check remaining credits and account details
- **Toolset Filtering** — Reduce context window by enabling only the toolsets you need
- **Caching** — Configurable TTL-based response caching
- **Retry** — Automatic retry with exponential backoff on rate limits

## Quick Start

### Prerequisites

- Node.js 20+
- A [Recraft API token](https://www.recraft.ai/profile/api)

### Install

```bash
npm install -g recraft-mcp
```

### Configure

Set the required environment variable:

```bash
export RECRAFT_API_TOKEN="your-api-token"
```

### Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "recraft": {
      "command": "npx",
      "args": ["-y", "recraft-mcp"],
      "env": {
        "RECRAFT_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Usage with Claude Code

```bash
claude mcp add recraft-mcp -e RECRAFT_API_TOKEN=your-api-token -- npx -y recraft-mcp
```

### Docker

```bash
docker run -e RECRAFT_API_TOKEN="your-api-token" ghcr.io/bartwaardenburg/recraft-mcp-server:latest
```

## Tools

### Generation Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate images from a text prompt with style, size, and artistic controls |
| `image_to_image` | Transform an existing image based on a text prompt with adjustable strength |
| `inpaint_image` | Fill in masked regions of an image based on a text prompt |
| `replace_background` | Replace the background while preserving the foreground subject |
| `generate_background` | Generate a background for masked areas of an image |

### Processing Tools

| Tool | Description |
|------|-------------|
| `remove_background` | Remove the background, leaving transparency |
| `erase_region` | Seamlessly erase a masked region from an image |
| `vectorize_image` | Convert raster images to scalable SVG vectors |
| `crisp_upscale` | Upscale with sharp detail preservation |
| `creative_upscale` | Upscale with creative enhancement and added detail |

### Style & User Tools

| Tool | Description |
|------|-------------|
| `create_style` | Create a custom style from 1-5 reference images |
| `get_style` | Get details of a custom style by ID |
| `list_styles` | List all custom styles |
| `list_basic_styles` | List available curated styles |
| `delete_style` | Delete a custom style |
| `get_current_user` | Get user info and remaining credits |

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `RECRAFT_API_TOKEN` | **Required.** Recraft API token | — |
| `RECRAFT_TOOLSETS` | Comma-separated list of toolsets to enable (`generation`, `processing`, `styles`) | All |
| `RECRAFT_CACHE_TTL` | Cache TTL in seconds (0 to disable) | 120 |
| `RECRAFT_MAX_RETRIES` | Maximum retry attempts on rate limit (429) | 3 |

### Toolset Filtering

Reduce the number of tools exposed to the LLM by setting `RECRAFT_TOOLSETS`:

```bash
# Only image generation tools
RECRAFT_TOOLSETS=generation

# Generation and processing, no style management
RECRAFT_TOOLSETS=generation,processing
```

## Supported Models

| Model | Description |
|-------|-------------|
| `recraftv3` | Recraft V3 (default) |
| `recraftv4` | Recraft V4 (latest raster) |
| `recraftv4_vector` | Recraft V4 Vector (SVG output) |
| `recraftv2` | Recraft V2 |
| `recraft20b` | Recraft 20B (legacy) |
| `refm1` | RefM1 |

> **Note:** V4 models do not support the `style` parameter — use the prompt to control style.

## Supported Styles

- `realistic_image` (default)
- `digital_illustration`
- `vector_illustration`
- `icon`
- `logo_raster`

Each style supports various substyles (e.g., `b_and_w`, `pixel_art`, `watercolor`, `pop_art`, etc.).

## Image Input

For tools that accept images (image_to_image, inpaint, upscale, etc.), provide images as:

- **URL** — A publicly accessible HTTP(S) URL to the image
- **Base64** — Raw base64-encoded image data

## Development

```bash
pnpm install
pnpm dev          # Run with tsx
pnpm build        # Compile TypeScript
pnpm test         # Run tests
pnpm typecheck    # Type check without emitting
```

## License

MIT
