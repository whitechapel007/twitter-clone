// ~/lib/auth/jwt.ts

import jwt from "jsonwebtoken";

// Define your JWT secret key.
// IMPORTANT: This should be stored securely in an environment variable, NOT hardcoded.
// You'll need to add JWT_SECRET to your .env file in the project root.
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key"; // Fallback for dev, but highly discouraged for production!
const ACCESS_TOKEN_EXPIRATION = "15m"; // e.g., '15m', '1h', '7d'
const REFRESH_TOKEN_EXPIRATION = "7d"; // Refresh tokens typically have longer expiry

// --- Interfaces for JWT Payloads ---
// Define what data you want to store in your tokens.
// It's good practice to keep payloads minimal for security and token size.
export interface AccessTokenPayload {
  userId: string;
  email: string;
  // Add any other essential user data you need for authorization
  // e.g., roles: string[];
}

export interface RefreshTokenPayload {
  userId: string;
  // Potentially include jti (JWT ID) for token invalidation strategies
  // jti: string;
}

// --- Token Generation Functions ---

/**
 * Generates a new access token.
 * @param payload The data to include in the token.
 * @returns A signed JWT access token string.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

/**
 * Generates a new refresh token.
 * @param payload The data to include in the token.
 * @returns A signed JWT refresh token string.
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

// --- Token Verification Functions ---

/**
 * Verifies an access token and returns its payload.
 * Throws an error if the token is invalid or expired.
 * @param token The JWT access token string.
 * @returns The decoded payload of the access token.
 */
export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as AccessTokenPayload);
    });
  });
}

/**
 * Verifies a refresh token and returns its payload.
 * Throws an error if the token is invalid or expired.
 * @param token The JWT refresh token string.
 * @returns The decoded payload of the refresh token.
 */
export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as RefreshTokenPayload);
    });
  });
}

// --- Token Extraction from Header ---

/**
 * Extracts the JWT token string from an 'Authorization: Bearer <token>' header.
 * @param header The value of the Authorization header.
 * @returns The token string or null if not found/invalid format.
 */
export function extractTokenFromHeader(
  header: string | undefined
): string | null {
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.substring(7); // "Bearer ".length === 7
}
