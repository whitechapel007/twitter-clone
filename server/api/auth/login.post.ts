// ~/server/api/auth/login.post.ts
import {
  AccessTokenPayload,
  generateAccessToken,
  generateRefreshToken,
  RefreshTokenPayload,
} from "@lib/auth/jwt";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";
import { createError, defineEventHandler, readBody } from "h3";
import { z } from "zod";

// Validation schema for login data
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate input data
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: validationResult.error.issues,
      });
    }

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Compare with hashed password stored in database
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    // Update the refresh token in the database for session management
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
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
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during login",
    });
  }
});
