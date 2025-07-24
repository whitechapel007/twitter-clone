// ~/server/middleware/auth.ts

import { createError, getHeader, getRequestURL } from "h3";
import {
  extractTokenFromHeader,
  verifyAccessToken,
} from "@lib/auth/jwt";

// Define protected paths
// Using a Set for O(1) average time complexity for lookups, better than Array.some() for many paths.
const PROTECTED_PATHS = new Set([
  "/api/auth/me",
  "/api/auth/logout",
  "/api/tweets",
  "/api/profile",
  // Add more protected paths here
]);

export default defineEventHandler(async (event) => {
  const urlPath = getRequestURL(event).pathname;

  // Check if the current path is protected
  // We use startsWith for broader matching (e.g., /api/tweets/123)
  const isProtectedRoute = Array.from(PROTECTED_PATHS).some((path) =>
    urlPath.startsWith(path)
  );

  // If not a protected route, skip authentication
  if (!isProtectedRoute) {
    return;
  }

  const authHeader = getHeader(event, "authorization");
  const token = extractTokenFromHeader(authHeader); // extractTokenFromHeader should return null if no token

  // If no token, throw 401
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Access token required",
    });
  }

  try {
    const user = await verifyAccessToken(token);
    // Attach user to event context for subsequent handlers/routes
    event.context.user = user;
  } catch (error) {
    // Catch specific JWT errors if needed for more granular messages
    // e.g., if (error instanceof TokenExpiredError) { ... }
    throw createError({
      statusCode: 401,
      statusMessage: "Token expired or invalid",
    });
  }
});
