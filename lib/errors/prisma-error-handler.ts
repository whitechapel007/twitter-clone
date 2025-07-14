import { Prisma } from "@prisma/client";
import { createError, type H3Error } from "h3";
import { z } from "zod";

export interface DatabaseErrorDetails {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
  clientVersion?: string;
}

export interface ErrorResponse {
  statusCode: number;
  statusMessage: string;
  data?: {
    error: string;
    details?: string;
    code?: string;
    meta?: Record<string, unknown>;
  };
}

/**
 * Maps Prisma error codes to user-friendly error responses
 */
const PRISMA_ERROR_MAP: Record<string, ErrorResponse> = {
  // Connection and database errors
  P1000: {
    statusCode: 503,
    statusMessage: "Database authentication failed",
    data: {
      error: "Database connection error",
      details: "Authentication failed for database user",
    },
  },
  P1001: {
    statusCode: 503,
    statusMessage: "Database server unreachable",
    data: {
      error: "Database connection error",
      details: "Cannot reach database server at the specified host and port",
    },
  },
  P1002: {
    statusCode: 503,
    statusMessage: "Database connection timeout",
    data: {
      error: "Database connection error",
      details: "Database server was reached but timed out",
    },
  },
  P1003: {
    statusCode: 503,
    statusMessage: "Database not found",
    data: {
      error: "Database configuration error",
      details: "Database file not found or database does not exist",
    },
  },
  P1008: {
    statusCode: 503,
    statusMessage: "Database operation timeout",
    data: {
      error: "Database timeout",
      details: "Operations timed out after specified duration",
    },
  },
  P1017: {
    statusCode: 503,
    statusMessage: "Database connection lost",
    data: {
      error: "Database connection error",
      details: "Server has closed the connection",
    },
  },
  P2031: {
    statusCode: 503,
    statusMessage: "Database connection failed",
    data: {
      error: "Database unavailable",
      details:
        "Could not establish connection to the database. Please ensure the database server is running",
    },
  },

  // Data validation and constraint errors
  P2002: {
    statusCode: 409,
    statusMessage: "Unique constraint violation",
    data: {
      error: "Duplicate data",
      details: "A record with this data already exists",
    },
  },
  P2003: {
    statusCode: 400,
    statusMessage: "Foreign key constraint violation",
    data: {
      error: "Invalid reference",
      details: "Referenced record does not exist",
    },
  },
  P2004: {
    statusCode: 400,
    statusMessage: "Database constraint violation",
    data: {
      error: "Data validation failed",
      details: "A constraint failed on the database",
    },
  },
  P2025: {
    statusCode: 404,
    statusMessage: "Record not found",
    data: {
      error: "Not found",
      details: "The requested record could not be found",
    },
  },

  // Query and operation errors
  P2021: {
    statusCode: 500,
    statusMessage: "Table does not exist",
    data: {
      error: "Database schema error",
      details: "The table does not exist in the current database",
    },
  },
  P2022: {
    statusCode: 500,
    statusMessage: "Column does not exist",
    data: {
      error: "Database schema error",
      details: "The column does not exist in the current database",
    },
  },
};

/**
 * Handles Prisma errors and converts them to user-friendly H3 errors
 */
export function handlePrismaError(error: unknown): H3Error {
  // Handle Prisma Client Known Request Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorConfig = PRISMA_ERROR_MAP[error.code];

    if (errorConfig) {
      // Enhance error details with specific information from the error
      const enhancedData = {
        ...errorConfig.data,
        code: error.code,
        meta: error.meta,
      };

      // Add specific details for certain error types
      if (error.code === "P2002" && error.meta?.target) {
        enhancedData.details = `A record with this ${
          Array.isArray(error.meta.target)
            ? error.meta.target.join(", ")
            : error.meta.target
        } already exists`;
      }

      return createError({
        statusCode: errorConfig.statusCode,
        statusMessage: errorConfig.statusMessage,
        data: enhancedData,
      });
    }

    // Fallback for unknown Prisma error codes
    return createError({
      statusCode: 500,
      statusMessage: "Database operation failed",
      data: {
        error: "Database error",
        details: error.message,
        code: error.code,
        meta: error.meta,
      },
    });
  }

  // Handle Prisma Client Validation Errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return createError({
      statusCode: 400,
      statusMessage: "Invalid data provided",
      data: {
        error: "Validation error",
        details: "The provided data is invalid or incomplete",
      },
    });
  }

  // Handle Prisma Client Initialization Errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return createError({
      statusCode: 503,
      statusMessage: "Database initialization failed",
      data: {
        error: "Database configuration error",
        details:
          "Failed to initialize database client. Check your database configuration",
      },
    });
  }

  // Handle Prisma Client Rust Panic Errors
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal database error",
      data: {
        error: "Database engine error",
        details: "An internal error occurred in the database engine",
      },
    });
  }

  // Handle generic errors
  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal server error",
      data: {
        error: "Unknown error",
        details: error.message,
      },
    });
  }

  // Fallback for unknown error types
  return createError({
    statusCode: 500,
    statusMessage: "Internal server error",
    data: {
      error: "Unknown error",
      details: "An unexpected error occurred",
    },
  });
}

/**
 * Check if an error is an H3Error (already handled)
 */
function isH3Error(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "statusCode" in error &&
    "statusMessage" in error &&
    typeof (error as Record<string, unknown>).statusCode === "number"
  );
}

/**
 * Wrapper function for database operations with automatic error handling
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // If it's already an H3Error, re-throw it as-is
    if (isH3Error(error)) {
      throw error;
    }
    // If it's a Zod validation error, re-throw it as-is (will be handled by API error handler)
    if (error instanceof z.ZodError) {
      throw error;
    }
    // Otherwise, handle as a Prisma error
    throw handlePrismaError(error);
  }
}

/**
 * Type guard to check if an error is a Prisma error
 */
export function isPrismaError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * Get user-friendly error message for a specific Prisma error code
 */
export function getPrismaErrorMessage(code: string): string {
  return PRISMA_ERROR_MAP[code]?.statusMessage || "Database operation failed";
}
