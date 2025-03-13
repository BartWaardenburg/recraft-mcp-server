/**
 * Environment configuration for the MCP server
 * This module handles all environment variables and their validation
 */

/**
 * Interface defining all required environment variables for the application
 * @interface EnvironmentConfig
 */
interface EnvironmentConfig {
  /** Recraft API URL */
  readonly RECRAFT_API_URL: string;
  /** Recraft API key for authentication */
  readonly RECRAFT_API_KEY: string;
}

/**
 * Environment configuration with default values
 * @constant
 * @type {EnvironmentConfig}
 */
export const ENV: EnvironmentConfig = {
  RECRAFT_API_URL:
    process.env.RECRAFT_API_URL || "https://external.api.recraft.ai",
  RECRAFT_API_KEY: process.env.RECRAFT_API_KEY || "",
} as const;

/**
 * Validates that all required environment variables are set
 * and that URLs are properly formatted
 * @throws {Error} If any required environment variables are missing or invalid
 */
const validateEnvironment = () => {
  const missingVars: string[] = [];

  if (!ENV.RECRAFT_API_KEY) missingVars.push("RECRAFT_API_KEY");

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  /* Validate Recraft API URL format */
  try {
    new URL(ENV.RECRAFT_API_URL);
  } catch (error) {
    console.error("Error validating RECRAFT_API_URL:", error);
    throw new Error(
      `Invalid RECRAFT_API_URL: ${ENV.RECRAFT_API_URL}. Must be a valid URL.`
    );
  }
};

/* Run validation on import */
validateEnvironment();
