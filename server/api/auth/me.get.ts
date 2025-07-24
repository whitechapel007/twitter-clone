// ~/server/api/auth/me.get.ts
import { extractTokenFromHeader, verifyAccessToken } from "@lib/auth/jwt";
import { prisma } from "@lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Extract the authorization header
    const authHeader = getHeader(event, "authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authorization token required",
      });
    }

    // Verify the access token
    let payload;
    try {
      payload = await verifyAccessToken(token);
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired token",
      });
    }
    // Find the user to ensure they exist
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not found",
      });
    }

    // Return success response
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    // Re-throw if it's already a createError
    if (error?.statusCode) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Server error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
