import type { EventHandlerRequest, H3Event } from "h3";
import {
  verifyAccessToken,
  extractTokenFromHeader,
  type TokenPayload,
} from "./jwt";

/**
 * Authentication middleware for protected routes
 */
export async function requireAuth(
  event: H3Event<EventHandlerRequest>
): Promise<TokenPayload> {
  // Try to get token from Authorization header first
  const authHeader = getHeader(event, "authorization");
  let token = extractTokenFromHeader(authHeader);

  // If no token in header, try to get from cookies
  if (!token) {
    token = getCookie(event, "access_token") || null;
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Access token required",
      data: { error: "NO_TOKEN" },
    });
  }

  // Verify and return the token payload
  return verifyAccessToken(token);
}

/**
 * Optional authentication middleware (doesn't throw if no token)
 */
export async function optionalAuth(
  event: H3Event<EventHandlerRequest>
): Promise<TokenPayload | null> {
  try {
    // Try to get token from Authorization header first
    const authHeader = getHeader(event, "authorization");
    let token = extractTokenFromHeader(authHeader);

    // If no token in header, try to get from cookies
    if (!token) {
      token = getCookie(event, "access_token") || null;
    }

    if (!token) return null;

    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

/**
 * Higher-order function to create protected API handlers
 */
export function withAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    event: H3Event<EventHandlerRequest>,
    user: TokenPayload
  ) => Promise<TOutput>
) {
  return async (
    input: TInput,
    event: H3Event<EventHandlerRequest>
  ): Promise<TOutput> => {
    const user = await requireAuth(event);
    return handler(input, event, user);
  };
}

/**
 * Higher-order function to create API handlers with optional auth
 */
export function withOptionalAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    event: H3Event<EventHandlerRequest>,
    user: TokenPayload | null
  ) => Promise<TOutput>
) {
  return async (
    input: TInput,
    event: H3Event<EventHandlerRequest>
  ): Promise<TOutput> => {
    const user = await optionalAuth(event);
    return handler(input, event, user);
  };
}
