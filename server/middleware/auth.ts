// ~/server/middleware/auth.ts

import { getCookie, getHeader } from "h3";
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
  ];

  // Skip auth for public routes
  const isProtectedRoute = protectedPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (!isProtectedRoute) {
    return; // Skip authentication for public routes
  }

  // Try to get token from cookies first, then Authorization header
  let token = getCookie(event, "access_token") || null;

  if (!token) {
    const authHeader = getHeader(event, "authorization");
    token = extractTokenFromHeader(authHeader) || null;
  }

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
