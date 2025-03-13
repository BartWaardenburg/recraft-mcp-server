# Recraft MCP Server

A [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/mcp) server implementation for integrating with [Recraft.ai](https://recraft.ai) services. This server enables AI assistants to generate images through Recraft's API using the MCP framework.

## 🌟 Features

- Implements MCP tools for Recraft image generation services
- Provides type-safe schemas using Zod for validation
- Supports various image generation options (styles, sizes, etc.)
- Easy integration with LLM assistants that support MCP

## 📋 Prerequisites

- Node.js (v18 or later recommended)
- A Recraft API key from [recraft.ai](https://recraft.ai)

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/recraft-mcp-server.git
   cd recraft-mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file and configure your API key:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Recraft API key.

## ⚙️ Configuration

The server uses the following environment variables:

- `RECRAFT_API_URL`: The Recraft API endpoint (default: https://external.api.recraft.ai)
- `RECRAFT_API_KEY`: Your Recraft API key

## 🔧 Usage

### Building the Server

```bash
npm run build
```

### Starting the Server

```bash
npm start
```

Or use the provided shell script:

```bash
./start-mcp.sh
```

### Development Mode

```bash
npm run dev
```

### Inspecting the MCP Server

The MCP SDK includes an inspector tool to test the server:

```bash
npm run inspect
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Watch mode for tests:

```bash
npm run test:watch
```

## 🔍 Validation

The project uses [Zod](https://github.com/colinhacks/zod) for schema validation. See `ZOD_IMPLEMENTATION.md` for details on the implementation.

## 📝 API

This server implements the following MCP tools:

- `generate_image`: Generate images from text prompts
- `image_to_image`: Transform an existing image based on a text prompt
- `inpaint_image`: Edit parts of an image using a mask
- `replace_background`: Replace the background of an image
- `vectorize_image`: Convert raster images to vector format
- `remove_background`: Remove the background from an image
- `crisp_upscale`: Upscale images with enhanced detail and clarity
- `creative_upscale`: Upscale images with creative enhancements
- `create_style`: Create a new style based on reference images
- `get_user_info`: Retrieve information about the current user
- `save_image_to_disk`: Save generated images to the local filesystem

The server also responds to a special `help` command which provides general information about the available tools, but this is handled as a special case in the server logic rather than as a formal tool definition.

For detailed information about the available parameters and options for each tool, use the MCP inspector tool or review the tool definitions in the code.

## 🛠️ Development

### Linting and Type Checking

```bash
# Run type checking
npm run type-check

# Run eslint
npm run lint

# Fix linting issues
npm run lint:fix

# Run both type checking and linting
npm run validate
```

## 📄 License

MIT
