import { z } from "zod";
import { createError, type H3Error } from "h3";
import {
  handlePrismaError,
  withDatabaseErrorHandling,
} from "./prisma-error-handler";

/**
 * Check if an error is an H3Error
 */
function isH3Error(error: unknown): error is H3Error {
  return (
    error !== null &&
    typeof error === "object" &&
    "statusCode" in error &&
    "statusMessage" in error &&
    typeof (error as Record<string, unknown>).statusCode === "number"
  );
}

/**
 * Generic API error handler that handles common error types
 */
export function handleApiError(error: unknown): never {
  // Handle validation errors
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation error",
      data: {
        error: "Invalid input",
        details: "The provided data is invalid",
        validationErrors: error.errors,
      },
    });
  }

  // If it's already an H3Error (from our error handler or manual throws), re-throw it
  if (isH3Error(error)) {
    throw error;
  }

  // Handle any other unexpected errors (including Prisma errors)
  throw handlePrismaError(error);
}

/**
 * Wrapper for API handlers that automatically handles common errors
 */
export function withApiErrorHandling<T>(handler: () => Promise<T>): Promise<T> {
  return handler().catch((error) => {
    handleApiError(error);
  });
}

/**
 * Wrapper specifically for database operations in API handlers
 */
export { withDatabaseErrorHandling };

/**
 * Combined wrapper that handles both API and database errors
 */
export async function withFullErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await withDatabaseErrorHandling(operation);
  } catch (error) {
    handleApiError(error);
  }
}
