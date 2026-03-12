import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";
import type { RecraftClient } from "../recraft-client.js";
import { toTextResult, toErrorResult } from "../tool-result.js";

const styleEnum = z.enum([
  "realistic_image",
  "digital_illustration",
  "vector_illustration",
  "icon",
  "logo_raster",
]);

export const registerStyleTools = (server: McpServer, client: RecraftClient): void => {
  server.registerTool(
    "create_style",
    {
      title: "Create Custom Style",
      description:
        "Create a custom style from 1-5 reference images. The style can be used in subsequent image generation " +
        "by passing the returned style_id. Reference images define the visual style that will be applied.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        images: z.array(z.string().min(1)).min(1).max(5).describe("1-5 reference images as URLs or base64-encoded strings."),
        style: styleEnum.describe("Base style category for the custom style."),
      }),
    },
    async ({ images, style }) => {
      try {
        const response = await client.createStyle({ images, style });
        return toTextResult(
          `Custom style created successfully.\n  Style ID: ${response.id}\n  Use this ID with the style_id parameter in generation tools.`,
          { id: response.id },
        );
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "get_style",
    {
      title: "Get Style Details",
      description: "Retrieve details of a custom style by its ID.",
      annotations: { readOnlyHint: true, openWorldHint: true },

      inputSchema: z.object({
        style_id: z.string().uuid().describe("The style ID to retrieve."),
      }),
    },
    async ({ style_id }) => {
      try {
        const response = await client.getStyle(style_id);
        const lines = [
          `Style: ${response.id}`,
          response.model ? `  Model: ${response.model}` : null,
          response.style ? `  Style: ${response.style}` : null,
          response.substyle ? `  Substyle: ${response.substyle}` : null,
        ].filter(Boolean);

        return toTextResult(lines.join("\n"), response as unknown as Record<string, unknown>);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "list_styles",
    {
      title: "List Custom Styles",
      description: "List all custom styles created by the authenticated user.",
      annotations: { readOnlyHint: true, openWorldHint: true },

      inputSchema: z.object({}),
    },
    async () => {
      try {
        const response = await client.listStyles();
        const styles = response.styles ?? [];

        if (styles.length === 0) {
          return toTextResult("No custom styles found. Create one with create_style.");
        }

        const lines = styles.map((s) => {
          const parts = [`  - ${s.id}`, s.style, s.substyle].filter(Boolean);
          return parts.join(", ");
        });

        return toTextResult(
          [`Found ${styles.length} custom style${styles.length !== 1 ? "s" : ""}`, ...lines].join("\n"),
          { styles } as unknown as Record<string, unknown>,
        );
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "list_basic_styles",
    {
      title: "List Basic Styles",
      description: "List all available curated/basic styles provided by Recraft. These can be used as the style parameter in generation tools.",
      annotations: { readOnlyHint: true, openWorldHint: true },

      inputSchema: z.object({}),
    },
    async () => {
      try {
        const response = await client.listBasicStyles();
        const styles = response.styles ?? [];

        if (styles.length === 0) {
          return toTextResult("No basic styles available.");
        }

        const lines = styles.map((s) => {
          const parts = [`  - ${s.id}`, s.style, s.substyle].filter(Boolean);
          return parts.join(", ");
        });

        return toTextResult(
          [`Available ${styles.length} basic style${styles.length !== 1 ? "s" : ""}`, ...lines].join("\n"),
          { styles } as unknown as Record<string, unknown>,
        );
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "delete_style",
    {
      title: "Delete Custom Style",
      description: "Delete a custom style by its ID. This action is irreversible.",
      annotations: { readOnlyHint: false, openWorldHint: true },

      inputSchema: z.object({
        style_id: z.string().uuid().describe("The style ID to delete."),
      }),
    },
    async ({ style_id }) => {
      try {
        await client.deleteStyle(style_id);
        return toTextResult(`Style ${style_id} deleted successfully.`);
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );

  server.registerTool(
    "get_current_user",
    {
      title: "Get Current User",
      description: "Retrieve information about the authenticated user, including remaining credits.",
      annotations: { readOnlyHint: true, openWorldHint: true },

      inputSchema: z.object({}),
    },
    async () => {
      try {
        const response = await client.getCurrentUser();
        return toTextResult(
          [
            `User: ${response.name}`,
            `  Email: ${response.email}`,
            `  Credits: ${response.credits}`,
            `  ID: ${response.id}`,
          ].join("\n"),
          response as unknown as Record<string, unknown>,
        );
      } catch (error) {
        return toErrorResult(error);
      }
    },
  );
};
