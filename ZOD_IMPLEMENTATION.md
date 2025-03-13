# Zod Implementation Guide

This document provides guidance on how Zod has been implemented in the Recraft MCP Server and how to use it effectively.

## What Was Added

1. **Schema Definitions**

   - `/src/schemas/recraft-styles.ts` - Zod schemas for style options
   - `/src/schemas/recraft.ts` - Zod schemas for API requests and responses
   - `/src/schemas/validation.ts` - Utility functions for validation

2. **Handler Updates**

   - Updated validation methods in `recraft-handlers.ts` to use Zod

3. **Documentation**
   - `/src/schemas/README.md` - Documentation for the schemas directory

## Why Zod?

Zod provides several advantages over manual validation:

1. **Type Safety**: Zod generates TypeScript types from schemas, eliminating type mismatches
2. **Detailed Error Messages**: When validation fails, Zod provides detailed error messages
3. **Self-Documenting**: The schemas document the expected structure of data
4. **Automatic Transformations**: Zod can transform data (e.g., strings to numbers) automatically
5. **Improved Code Organization**: Validation logic is centralized in schemas

## How to Use Zod in This Project

### Validating Input

```typescript
import { validateSchema } from "../schemas/validation.js";
import { GenerateImageArgsSchema } from "../schemas/recraft.js";

function processRequest(args: unknown) {
  try {
    // Validate and get typed data
    const validatedArgs = validateSchema(GenerateImageArgsSchema, args);

    // Now you can safely use validatedArgs with proper TypeScript types
    const { prompt, style } = validatedArgs;

    // Process the request...
  } catch (error) {
    // Handle validation error
    console.error(error.message);
  }
}
```

### Using Types from Schemas

```typescript
import type { GenerateImageArgs } from "../schemas/recraft.js";

// Function accepts only valid parameters
function generateImage(params: GenerateImageArgs) {
  // Type-safe access to all properties
}
```

### Adding New Schemas

When adding new functionality:

1. Define a schema in the appropriate file
2. Export the schema and its inferred type
3. Use the schema for validation in handlers

Example:

```typescript
// In schema file
export const NewFeatureSchema = z.object({
  param1: z.string(),
  param2: z.number(),
});

export type NewFeature = z.infer<typeof NewFeatureSchema>;

// In handler
import { validateSchema } from "../schemas/validation.js";
import { NewFeatureSchema, type NewFeature } from "../schemas/feature.js";

function handleNewFeature(args: unknown): NewFeature {
  return validateSchema(NewFeatureSchema, args);
}
```

## Advanced Features

### String-to-Number Transformations

The schemas now support automatic transformation of string values to numbers. This is particularly useful for parameters like `n` (number of images) and `strength` (for image-to-image transformations) that might be provided as strings in some contexts:

```typescript
// Example from GenerateImageArgsSchema
n: z
  .union([
    z.number().int().min(1).max(6),
    z.string().transform((n) => parseInt(n, 10)),
  ])
  .optional(),

// Example from ImageToImageArgsSchema
strength: z.union([
  z.number().min(0).max(1),
  z.string().transform((s) => parseFloat(s)),
]),
```

This allows the API to be more flexible, accepting both string and number inputs for numeric parameters.

### Type-Safe Validation with `validateSchemaAs`

A new utility function `validateSchemaAs` has been added to handle cases where Zod's transformations might cause type incompatibilities:

```typescript
/**
 * Validate data against a schema and cast the result to a specific type
 * Useful when Zod schema includes transformations (like string to number)
 * but the return type needs to match a specific interface
 */
export const validateSchemaAs = <T, R>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorPrefix = "Validation error"
): R => {
  const validatedData = validateSchema(schema, data, errorPrefix);
  return validatedData as unknown as R;
};
```

This function is used in the handler methods to ensure that the transformed data still matches the expected types:

```typescript
// Example usage in a handler method
private validateGenerateImageArgs(args: unknown): GenerateImageArgs {
  try {
    return validateSchemaAs<unknown, GenerateImageArgs>(
      GenerateImageArgsSchema,
      args
    );
  } catch (error) {
    // Error handling
  }
}
```

This approach maintains type safety while allowing for flexible input formats.

## Troubleshooting Common Errors

### "Invalid style" Error

If you receive an error like `Invalid style: "realistic"`, it means you provided a style value that's not in the allowed list. Check the error message for valid options:

```
Invalid style: "realistic". Valid options are: any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster
```

### Handling File/Buffer Validation

For file uploads or buffer data, the custom `BufferOrFileSchema` has been created to handle validation of these types. This handles Buffer, File, and string path values.

## Next Steps and Recommendations

1. Add schema validation at API entry points for early error detection
2. Consider adding custom error handling middleware for consistent error responses
3. Update OpenAPI/Swagger documentation to match Zod schemas
4. Add unit tests for schema validation

## Resources

- [Zod Documentation](https://zod.dev/)
- [TypeScript Integration](https://zod.dev/?id=type-inference)
