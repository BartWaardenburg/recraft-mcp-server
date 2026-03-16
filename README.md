<p align="center">
  <h1 align="center">recraft-mcp</h1>
  <p align="center">
    MCP server for AI image generation, transformation, and style management via the <a href="https://www.recraft.ai/api">Recraft API</a>
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/recraft-mcp"><img src="https://img.shields.io/npm/v/recraft-mcp?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/recraft-mcp"><img src="https://img.shields.io/npm/dm/recraft-mcp?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/BartWaardenburg/recraft-mcp-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/recraft-mcp?style=flat-square" alt="license"></a>
  <a href="https://github.com/BartWaardenburg/recraft-mcp-server/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/BartWaardenburg/recraft-mcp-server/ci.yml?style=flat-square&label=CI" alt="CI"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/node/v/recraft-mcp?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://smithery.ai/server/recraft-mcp"><img src="https://smithery.ai/badge/recraft-mcp" alt="Smithery"></a>
</p>

<p align="center">
  <a href="https://vscode.dev/redirect/mcp/install?name=recraft&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22api_token%22%2C%22description%22%3A%22Recraft+API+Token%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22recraft-mcp%22%5D%2C%22env%22%3A%7B%22RECRAFT_API_TOKEN%22%3A%22%24%7Binput%3Aapi_token%7D%22%7D%7D"><img src="https://img.shields.io/badge/VS_Code-Install_with_NPX-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Install with NPX in VS Code"></a>
  <a href="https://vscode.dev/redirect/mcp/install?name=recraft&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22api_token%22%2C%22description%22%3A%22Recraft+API+Token%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22--rm%22%2C%22-i%22%2C%22-e%22%2C%22RECRAFT_API_TOKEN%3D%24%7Binput%3Aapi_token%7D%22%2C%22ghcr.io%2Fbartwaardenburg%2Frecraft-mcp-server%3Alatest%22%5D%7D"><img src="https://img.shields.io/badge/VS_Code-Install_with_Docker-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Install with Docker in VS Code"></a>
</p>

---

> **Note:** This is an unofficial, community-maintained project and is not affiliated with or endorsed by Recraft.

**16 tools** for image generation, processing, and style management — all accessible through the [Model Context Protocol](https://modelcontextprotocol.io/).

- **Generate** — Text-to-image, image-to-image, inpainting, background replacement & generation
- **Process** — Background removal, region erasing, vectorization (SVG), crisp & creative upscaling
- **Styles** — Create custom styles from reference images, list/get/delete styles
- **Account** — Check remaining credits and user info (included in `styles` toolset)
- **Configurable** — Filter toolsets, adjust cache TTL, control retries

## Prerequisites

- Node.js 20+ (or Docker)
- A [Recraft API token](https://www.recraft.ai/profile/api)

## Installation

### Claude Desktop

Add to your config file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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

### VS Code

Add to `.vscode/mcp.json` in your workspace (or use the one-click install buttons above):

```json
{
  "servers": {
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

### Claude Code

```bash
claude mcp add recraft-mcp -e RECRAFT_API_TOKEN=your-api-token -- npx -y recraft-mcp
```

### Cursor

Add to Cursor's MCP settings (`~/.cursor/mcp.json`):

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

### Windsurf

Add to Windsurf's MCP config (`~/.codeium/windsurf/mcp_config.json`):

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

### Docker

```bash
docker run --rm -i -e RECRAFT_API_TOKEN="your-api-token" ghcr.io/bartwaardenburg/recraft-mcp-server:latest
```

Use Docker in any MCP client by replacing the command:

```json
{
  "mcpServers": {
    "recraft": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "RECRAFT_API_TOKEN=your-api-token",
        "ghcr.io/bartwaardenburg/recraft-mcp-server:latest"
      ]
    }
  }
}
```

### Smithery

```bash
npx -y @smithery/cli install recraft-mcp --client claude
```

## Tools

### Generation

| Tool | Description |
|------|-------------|
| `generate_image` | Generate images from a text prompt with style, size, and artistic controls |
| `image_to_image` | Transform an existing image based on a text prompt with adjustable strength |
| `inpaint_image` | Fill in masked regions of an image based on a text prompt |
| `replace_background` | Replace the background while preserving the foreground subject |
| `generate_background` | Generate a background for masked areas of an image |

### Processing

| Tool | Description |
|------|-------------|
| `remove_background` | Remove the background, leaving transparency |
| `erase_region` | Seamlessly erase a masked region from an image |
| `vectorize_image` | Convert raster images to scalable SVG vectors |
| `crisp_upscale` | Upscale with sharp detail preservation |
| `creative_upscale` | Upscale with creative enhancement and added detail |

### Styles & Account

| Tool | Description |
|------|-------------|
| `create_style` | Create a custom style from 1-5 reference images |
| `get_style` | Get details of a custom style by ID |
| `list_styles` | List all custom styles |
| `list_basic_styles` | List available curated styles |
| `delete_style` | Delete a custom style |
| `get_current_user` | Get user info and remaining credits |

### Tool Annotations

All tools include [MCP tool annotations](https://modelcontextprotocol.io/docs/concepts/tools#tool-annotations) to help clients understand their behavior:

| Tool | Read-only | Open-world |
|------|:---------:|:----------:|
| `generate_image` | | Yes |
| `image_to_image` | | Yes |
| `inpaint_image` | | Yes |
| `replace_background` | | Yes |
| `generate_background` | | Yes |
| `remove_background` | | Yes |
| `erase_region` | | Yes |
| `vectorize_image` | | Yes |
| `crisp_upscale` | | Yes |
| `creative_upscale` | | Yes |
| `create_style` | | Yes |
| `get_style` | Yes | Yes |
| `list_styles` | Yes | Yes |
| `list_basic_styles` | Yes | Yes |
| `delete_style` | | Yes |
| `get_current_user` | Yes | Yes |

<details>
<summary><strong>Detailed Parameter Reference</strong></summary>

#### `generate_image`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `prompt` | string | Yes | Text description (max 1000 chars V2/V3, 10000 V4) |
| `model` | enum | | `recraftv3` (default), `recraftv4`, `recraftv4_vector`, `recraftv2`, `recraft20b`, `refm1` |
| `style` | enum | | `realistic_image` (default), `digital_illustration`, `vector_illustration`, `icon`, `logo_raster` |
| `substyle` | string | | Substyle refinement (e.g. `b_and_w`, `pixel_art`, `watercolor`) |
| `style_id` | uuid | | Custom style ID (mutually exclusive with style/substyle) |
| `size` | enum | | Image dimensions, e.g. `1024x1024` (default), `1365x1024`, `1536x1024`, etc. |
| `n` | integer | | Number of images to generate (1-6, default 1) |
| `negative_prompt` | string | | What to avoid in the image |
| `artistic_level` | integer | | 0 (simple) to 5 (dynamic) |
| `no_text` | boolean | | Prevent text in the image |
| `image_format` | enum | | `webp` or `png` |
| `random_seed` | integer | | Seed for reproducible results |

#### `image_to_image`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Source image (URL or base64). Max 5MB, <16MP, max 4096px per side |
| `prompt` | string | Yes | Description of desired changes |
| `strength` | number | Yes | Change magnitude: 0.0 (minimal) to 1.0 (maximum) |
| `model` | enum | | Model to use |
| `style` | enum | | Style category (not supported for V4) |
| `substyle` | string | | Substyle refinement |
| `style_id` | uuid | | Custom style ID |
| `n` | integer | | Number of outputs (1-6) |
| `negative_prompt` | string | | What to avoid |
| `image_format` | enum | | `webp` or `png` |
| `random_seed` | integer | | Seed for reproducibility |

#### `inpaint_image`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Source image (URL or base64) |
| `mask` | string | Yes | Grayscale PNG mask (white = inpaint, black = preserve) |
| `prompt` | string | Yes | What to generate in the masked area |
| `model`, `style`, `substyle`, `style_id`, `n`, `negative_prompt`, `image_format`, `random_seed` | | | Same as generate_image |

#### `replace_background`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Source image (URL or base64) |
| `prompt` | string | Yes | Description of the new background |
| `model`, `style`, `substyle`, `style_id`, `n`, `negative_prompt`, `image_format`, `random_seed` | | | Same as generate_image |

#### `generate_background`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Source image (URL or base64) |
| `mask` | string | Yes | Mask defining the background area |
| `prompt` | string | Yes | Description of the background to generate |
| `model`, `style`, `substyle`, `style_id`, `n`, `negative_prompt`, `image_format`, `random_seed` | | | Same as generate_image |

#### `remove_background`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Image (URL or base64) |
| `image_format` | enum | | `webp` or `png` |

#### `erase_region`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Source image (URL or base64) |
| `mask` | string | Yes | Grayscale mask (white = erase, black = preserve) |
| `image_format` | enum | | `webp` or `png` |

#### `vectorize_image`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Image to vectorize (URL or base64) |

#### `crisp_upscale`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Image to upscale (URL or base64). Max 5MB, <4MP |
| `image_format` | enum | | `webp` or `png` |

#### `creative_upscale`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `image` | string | Yes | Image to upscale (URL or base64). Max 5MB, <16MP |
| `image_format` | enum | | `webp` or `png` |

#### `create_style`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `images` | string[] | Yes | 1-5 reference images (URLs or base64) |
| `style` | enum | Yes | Base style category |

#### `get_style`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `style_id` | uuid | Yes | Style ID to retrieve |

#### `delete_style`

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `style_id` | uuid | Yes | Style ID to delete |

#### `list_styles`, `list_basic_styles`, `get_current_user`

No parameters required.

</details>

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `RECRAFT_API_TOKEN` | **Required.** Your [Recraft API token](https://www.recraft.ai/profile/api) | — |
| `RECRAFT_TOOLSETS` | Comma-separated toolsets to enable: `generation`, `processing`, `styles` | All |
| `RECRAFT_CACHE_TTL` | Cache TTL in seconds (`0` to disable) | `120` |
| `RECRAFT_MAX_RETRIES` | Max retry attempts on rate limit (429) | `3` |

### Toolset Filtering

Reduce the number of tools exposed to the LLM by enabling only what you need:

```bash
# Only image generation
RECRAFT_TOOLSETS=generation

# Generation + processing, no style management
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

| Style | Substyles |
|-------|-----------|
| `realistic_image` (default) | `b_and_w`, `enterprise`, `hard_flash`, `hdr`, `motion_blur`, `natural_light`, `studio_portrait` |
| `digital_illustration` | `pixel_art`, `hand_drawn`, `grain`, `infantile_sketch`, `2d_art_poster`, `handmade_3d`, `engraving`, `comic_book` |
| `vector_illustration` | `bold_stroke`, `chemistry`, `colored_stencil`, `contour_pop_art`, `flat_2`, `line_art`, `line_circuit` |
| `icon` | `broken_line`, `colored_outline`, `colored_shapes`, `doodle_fill`, `doodle_offset_fill`, `offset_fill`, `outline` |
| `logo_raster` | — |

## Image Input

Tools that accept images (`image_to_image`, `inpaint_image`, `remove_background`, etc.) support:

- **URL** — Any publicly accessible HTTP(S) URL
- **Base64** — Raw base64-encoded image data

## Security

- **API token** — Your `RECRAFT_API_TOKEN` is sent only to the Recraft API (`https://external.api.recraft.ai`). It is never logged or stored beyond the process lifetime.
- **Image data** — Images are sent to Recraft's servers for processing. No image data is cached on disk.
- **Network access** — This server makes outbound HTTPS requests to `external.api.recraft.ai` and `registry.npmjs.org` (for update checks).

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Development

```bash
pnpm install         # Install dependencies
pnpm dev             # Run with tsx (hot reload)
pnpm build           # Compile TypeScript
pnpm test            # Run tests
pnpm typecheck       # Type check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
