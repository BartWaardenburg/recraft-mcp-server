#!/usr/bin/env node

/**
 * @fileoverview Main entry point for the Recraft MCP server
 * This file initializes and runs the Model Context Protocol server that provides
 * integration with Recraft tools.
 */

import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { toolDefinitions } from "./tools/definitions.js";
import { ToolHandlers } from "./tools/handlers.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import type {
  RecraftImagesResponse,
  RecraftImageResponse,
  RecraftStyleResponse,
} from "./types/recraft.js";

/* Interface for file operation response */
interface FileOperationResponse {
  success: boolean;
  file_path: string;
  message: string;
}

/* Interface for MCP response */
interface McpResponse {
  [key: string]: unknown;
  _meta?: { [key: string]: unknown };
}

/* Type for all possible tool responses */
type ToolResponse =
  | RecraftImagesResponse
  | RecraftImageResponse
  | RecraftStyleResponse
  | FileOperationResponse;

/**
 * Retrieves package information from package.json for server configuration
 * @returns {Object} Object containing name and version from package.json
 */
const getPackageInfo = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = resolve(__dirname, "../package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (error) {
    console.error("Error reading package.json:", error);
    // Fallback to defaults if package.json cannot be read
    return {
      name: "recraft-mcp-server",
      version: "0.1.0",
    };
  }
};

/**
 * Available Tools:
 */

/**
 * Main server class that handles MCP protocol communication and routes tool requests
 * @class
 */
class RecraftMcpServer {
  private readonly server: Server;
  private readonly toolHandlers: ToolHandlers;

  /**
   * Initializes the MCP server with tool definitions and sets up request handlers
   * @constructor
   */
  constructor() {
    const { name, version } = getPackageInfo();

    this.server = new Server(
      {
        name,
        version,
      },
      {
        capabilities: {
          tools: toolDefinitions,
          /* Indicate support for resources and prompts capabilities */
          resources: {},
          prompts: {},
        },
      }
    );

    this.toolHandlers = new ToolHandlers();

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Sets up handlers for tool requests and routes them to appropriate methods
   * @private
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.entries(toolDefinitions).map(([name, def]) => ({
        name,
        ...def,
      })),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        let response: ToolResponse;
        switch (request.params.name) {
          case "generate_image":
            response = await this.toolHandlers.handleGenerateImage(
              request.params.arguments
            );
            break;

          case "image_to_image":
            response = await this.toolHandlers.handleImageToImage(
              request.params.arguments
            );
            break;

          case "inpaint_image":
            response = await this.toolHandlers.handleInpaintImage(
              request.params.arguments
            );
            break;

          case "replace_background":
            response = await this.toolHandlers.handleReplaceBackground(
              request.params.arguments
            );
            break;

          case "vectorize_image":
            response = await this.toolHandlers.handleVectorizeImage(
              request.params.arguments
            );
            break;

          case "remove_background":
            response = await this.toolHandlers.handleRemoveBackground(
              request.params.arguments
            );
            break;

          case "crisp_upscale":
            response = await this.toolHandlers.handleCrispUpscale(
              request.params.arguments
            );
            break;

          case "creative_upscale":
            response = await this.toolHandlers.handleCreativeUpscale(
              request.params.arguments
            );
            break;

          case "create_style":
            response = await this.toolHandlers.handleCreateStyle(
              request.params.arguments
            );
            break;

          case "get_user_info":
            response = await this.toolHandlers.handleGetUserInfo();
            break;

          case "save_image_to_disk":
            response = await this.toolHandlers.handleSaveImageToDisk(
              request.params.arguments
            );
            break;

          default:
            throw new McpError(
              ErrorCode.InvalidParams,
              `Unknown tool: ${request.params.name}`
            );
        }

        // Convert response to MCP format
        const mcpResponse: McpResponse = {
          ...response,
        };

        return mcpResponse;
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        if (error instanceof Error) {
          throw new McpError(ErrorCode.InternalError, error.message);
        }

        throw new McpError(
          ErrorCode.InternalError,
          "An unknown error occurred"
        );
      }
    });
  }

  /**
   * Sets up handlers for resource-related requests
   * @private
   */
  private setupResourceHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      // Return an empty list of resources for now
      // This can be expanded later to include actual resources
      return {
        resources: [],
      };
    });
  }

  /**
   * Sets up handlers for prompt-related requests
   * @private
   */
  private setupPromptHandlers(): void {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      // Return an empty list of prompts for now
      // This can be expanded later to include actual prompts
      return {
        prompts: [],
      };
    });
  }

  /**
   * Starts the server using stdio transport
   * @returns {Promise<void>} Promise that resolves when the server is running
   * @public
   */
  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Recraft MCP server running on stdio");
  }
}

const recraftMcpServer = new RecraftMcpServer();
recraftMcpServer.run().catch((error: Error) => console.error(error));
