// ~/server/api/auth/register.post.ts
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

// Validation schema for registration data
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /\d/.test(password),
      "Password must contain at least one number"
    ),
  dob: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - parsedDate.getFullYear();
    return age >= 13; // Minimum age requirement
  }, "You must be at least 13 years old"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate input data
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: validationResult.error.issues,
      });
    }

    const { username, name, email, password, dob } = validationResult.data;

    // Check if user already exists (email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      throw createError({
        statusCode: 409,
        statusMessage: `User with this ${field} already exists`,
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        dob: new Date(dob),
        // profileImage will use the default value from schema
      },
    });

    // Generate tokens
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);

    // Optionally store the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Return success response (exclude sensitive data)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        dob: user.dob,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    // Handle Prisma errors
    if (error?.code === "P2002") {
      throw createError({
        statusCode: 409,
        statusMessage: "User with this email or username already exists",
      });
    }

    // Re-throw if it's already a createError
    if (error?.statusCode) {
      throw error;
    }

    // Handle unexpected errors
    console.error("Registration error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during registration",
    });
  }
});
