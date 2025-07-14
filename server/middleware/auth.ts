// ~/server/middleware/auth.ts

import { getHeader } from "h3";
import { verifyAccessToken, extractTokenFromHeader } from "~/lib/auth/jwt";

export default defineEventHandler(async (event) => {
  // Only run auth middleware on protected routes
  const url = getRequestURL(event);
  const protectedPaths = [
    "/api/auth/me",
    "/api/auth/logout",
    "/api/tweets",
    "/api/profile",
    // Add more protected paths here
    // Note: /api/auth/refresh is NOT protected since it's used to get new tokens
  ];

  // Skip auth for public routes
  const isProtectedRoute = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (!isProtectedRoute) {
    return; // Skip authentication for public routes
  }

  // Try to get token from Authorization header first
  const authHeader = getHeader(event, "authorization");
  const token = extractTokenFromHeader(authHeader) || null;

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Access token required",
    });
  }

  try {
    const user = verifyAccessToken(token);
    event.context.user = user;
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Token expired or invalid",
    });
  }
});
