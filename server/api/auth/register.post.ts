import prisma from "~/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createApiHandler } from "~/lib/utils/api-helpers";
import { generateTokenPair } from "~/lib/auth/jwt";
import type { EventHandlerRequest, H3Event } from "h3";

const registerUserSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(3).max(30),
  password: z.string().min(6).max(30),
  dob: z.string().datetime(),
  email: z.string().email(),
});

type RegisterUserInput = z.infer<typeof registerUserSchema>;

async function createUser(
  userData: RegisterUserInput,
  event: H3Event<EventHandlerRequest>
) {
  console.log("Creating user with data:", {
    email: userData.email,
    username: userData.username,
    name: userData.name,
    hasDob: !!userData.dob,
  });

  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log("User already exists:", userData.email);
      throw createError({
        statusCode: 409,
        statusMessage: "User already exists with this email",
      });
    }
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error; // Re-throw H3 errors
    }
    console.error("Database error checking existing user:", error);
    throw createError({
      statusCode: 503,
      statusMessage: "Database connection error",
      data: {
        error: "Database unavailable",
        details:
          error instanceof Error ? error.message : "Unknown database error",
      },
    });
  }

  // Hash the password
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(userData.password, 10);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Password processing failed",
      data: { error: "Internal server error" },
    });
  }

  // Create user with hashed password and default profile image
  let newUser;
  try {
    newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    console.log("User created successfully:", newUser.id);
  } catch (error) {
    console.error("User creation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "User creation failed",
      data: {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }

  // Generate JWT tokens for automatic login
  let tokens;
  try {
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    tokens = generateTokenPair(tokenPayload);
    console.log("JWT tokens generated successfully");
  } catch (error) {
    console.error("JWT generation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Authentication token generation failed",
      data: {
        error: "JWT error",
        details: error instanceof Error ? error.message : "Unknown JWT error",
      },
    });
  }

  // Update user's refresh token in database
  try {
    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });
    console.log("User refresh token updated successfully");
  } catch (error) {
    console.error("Refresh token update error:", error);
    // Don't throw here as user is already created, just log the error
    console.warn("User created but refresh token update failed");
  }

  // Set HTTP-only cookie for refresh token
  try {
    setCookie(event, "refresh_token", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log("Refresh token cookie set successfully");
  } catch (error) {
    console.error("Cookie setting error:", error);
    // Don't throw here as user is already created, just log the error
    console.warn("User created but cookie setting failed");
  }

  // Return only safe fields (exclude password) with access token
  const { password, refreshToken, ...safeUser } = newUser;
  return {
    user: safeUser,
    accessToken: tokens.accessToken,
  };
}

export default createApiHandler({
  schema: registerUserSchema,
  handler: async (input, event) => {
    try {
      return await createUser(input, event);
    } catch (error) {
      console.error("Registration handler error:", error);

      // Re-throw the error to be handled by the error handler
      throw error;
    }
  },
});
