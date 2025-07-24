// ~/server/api/auth/logout.post.ts
import { extractTokenFromHeader, verifyAccessToken } from "@lib/auth/jwt";
import { prisma } from "@lib/prisma";
import { createError, defineEventHandler, getHeader } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Read request body for optional parameters
    const body = await readBody(event).catch(() => ({}));
    const { logoutFromAllDevices = false } = body;

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

    // Clear the refresh token from the database
    // This invalidates the user's session
    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });

    // Log the logout action (optional: for security auditing)
    console.log(
      `User ${payload.userId} (${payload.email}) logged out${
        logoutFromAllDevices ? " from all devices" : ""
      }`
    );

    // Return success response
    return {
      success: true,
      message: logoutFromAllDevices
        ? "Successfully logged out from all devices"
        : "Successfully logged out",
      loggedOutFromAllDevices: logoutFromAllDevices,
    };
  } catch (error: any) {
    // Re-throw if it's already a createError
    if (error?.statusCode) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Logout error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during logout",
    });
  }
});
