/**
 * @fileoverview Validation utilities for Zod schemas
 * This file contains helper functions for validating data with Zod schemas
 */

import { z } from "zod";
import { RecraftStyleV3Schema } from "./recraft-styles.js";

/**
 * Generic validation error
 */
export class ValidationError extends Error {
  issues: z.ZodIssue[];

  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {z.ZodIssue[]} issues - Validation issues from Zod
   */
  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

/**
 * Format a validation error into a user-friendly message
 * @param {z.ZodError} error - The Zod error to format
 * @returns {string} Formatted error message
 */
export const formatZodError = (error: z.ZodError): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");

      // Special handling for style validation errors
      if (path.includes("style") && issue.code === "invalid_enum_value") {
        const invalidEnum = issue as z.ZodIssueOptionalMessage & {
          received: unknown;
        };
        return `Invalid style: "${String(
          invalidEnum.received
        )}". Valid options are: ${Object.values(RecraftStyleV3Schema.enum).join(
          ", "
        )}`;
      }

      return `${path ? path + ": " : ""}${issue.message}`;
    })
    .join("; ");
};

/**
 * Validate data against a schema and throw formatted error if invalid
 * @param {z.ZodSchema} schema - The schema to validate against
 * @param {unknown} data - The data to validate
 * @param {string} [errorPrefix='Validation error'] - Prefix for the error message
 * @returns {T} The validated data
 * @throws {ValidationError} If validation fails
 */
export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorPrefix = "Validation error"
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = formatZodError(result.error);
    throw new ValidationError(
      `${errorPrefix}: ${errorMessage}`,
      result.error.issues
    );
  }

  // Return the validated and transformed data
  return result.data;
};

/**
 * Validate data against a schema and cast the result to a specific type
 * Useful when Zod schema includes transformations (like string to number)
 * but the return type needs to match a specific interface
 *
 * @param {z.ZodSchema} schema - The schema to validate against
 * @param {unknown} data - The data to validate
 * @param {string} [errorPrefix='Validation error'] - Prefix for the error message
 * @returns {R} The validated data cast to the required type
 * @throws {ValidationError} If validation fails
 */
export const validateSchemaAs = <T, R>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorPrefix = "Validation error"
): R => {
  const validatedData = validateSchema(schema, data, errorPrefix);
  return validatedData as unknown as R;
};

/**
 * Try to validate data against a schema, returning null if invalid
 * @param {z.ZodSchema} schema - The schema to validate against
 * @param {unknown} data - The data to validate
 * @returns {[null | string, null | T]} Tuple with error message and validated data
 */
export const tryValidateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): [null | string, null | T] => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return [formatZodError(result.error), null];
  }

  return [null, result.data];
};
