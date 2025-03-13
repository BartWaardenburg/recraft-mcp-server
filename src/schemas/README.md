# Zod Schemas for Recraft MCP Server

This directory contains the Zod schemas used for validating input and output data in the Recraft MCP server.

## Overview

Zod is a TypeScript-first schema declaration and validation library. It allows us to:

1. Define schemas for our data
2. Validate data against those schemas
3. Generate TypeScript types from schemas
4. Get detailed error messages when validation fails

## Key Files

- `recraft-styles.ts` - Schemas for Recraft API styles and substyles
- `recraft.ts` - Schemas for Recraft API requests and responses
- `validation.ts` - Utility functions for schema validation

## Usage

### Validating Data

```typescript
import { validateSchema } from "../schemas/validation.js";
import { GenerateImageArgsSchema } from "../schemas/recraft.js";

// Validate unknown input
try {
  const validatedData = validateSchema(GenerateImageArgsSchema, unknownInput);
  // Use the validated data with proper types
} catch (error) {
  // Handle validation error with detailed messages
  console.error(error.message);
}
```

### Using Types from Schemas

```typescript
import type { GenerateImageArgs } from "../schemas/recraft.js";

// This function accepts only valid image generation parameters
function generateImage(params: GenerateImageArgs) {
  // Type-safe access to all properties
}
```

## Style Validation

The `recraft-styles.ts` file contains schemas for all valid styles and substyles:

- `RecraftStyleV3Schema` - Valid image styles (e.g., 'realistic_image', 'digital_illustration')
- `RecraftSubstyleV3Schema` - Valid substyles for each style
- `RecraftImageSizeSchema` - Valid image sizes

When a style validation error occurs, the error message will include the list of valid options.

## Benefits

- **Runtime Type Safety**: Catches type errors at runtime that TypeScript can't catch
- **Automatic Type Inference**: No need to maintain duplicate type definitions
- **Detailed Error Messages**: Makes debugging and error handling easier
- **Self-Documenting**: Schemas serve as documentation for valid inputs

## Example Error Messages

When an invalid style is provided:

```
Invalid style: "realistic". Valid options are: any, realistic_image, digital_illustration, vector_illustration, icon, logo_raster
```

When required field is missing:

```
Validation error: prompt: Required
```
