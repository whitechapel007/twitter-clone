import jwt from "jsonwebtoken";


// JWT Configuration
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// Validate that secrets are set
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT secrets are not configured. Please set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in your .env file"
  );
}

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: "twitter-clone",
    audience: "twitter-clone-users",
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: "twitter-clone",
    audience: "twitter-clone-users",
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: TokenPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: "twitter-clone",
      audience: "twitter-clone-users",
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw createError({
          statusCode: 401,
          statusMessage: "Access token expired",
          data: { error: "TOKEN_EXPIRED" },
        });
      }
      if (error.name === "JsonWebTokenError") {
        throw createError({
          statusCode: 401,
          statusMessage: "Invalid access token",
          data: { error: "INVALID_TOKEN" },
        });
      }
    }
    throw createError({
      statusCode: 401,
      statusMessage: "Token verification failed",
      data: { error: "TOKEN_VERIFICATION_FAILED" },
    });
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: "twitter-clone",
      audience: "twitter-clone-users",
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw createError({
          statusCode: 401,
          statusMessage: "Refresh token expired",
          data: { error: "REFRESH_TOKEN_EXPIRED" },
        });
      }
      if (error.name === "JsonWebTokenError") {
        throw createError({
          statusCode: 401,
          statusMessage: "Invalid refresh token",
          data: { error: "INVALID_REFRESH_TOKEN" },
        });
      }
    }
    throw createError({
      statusCode: 401,
      statusMessage: "Refresh token verification failed",
      data: { error: "REFRESH_TOKEN_VERIFICATION_FAILED" },
    });
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}

/**
 * Get token expiry time in seconds
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    return decoded?.exp || null;
  } catch {
    return null;
  }
}
