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
  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists with this email",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user with hashed password and default profile image
  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  // Generate JWT tokens for automatic login
  const tokenPayload = {
    userId: newUser.id,
    email: newUser.email,
    username: newUser.username,
  };

  const tokens = generateTokenPair(tokenPayload);

  // Update user's refresh token in database
  await prisma.user.update({
    where: { id: newUser.id },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });

  // Set HTTP-only cookie for refresh token
  setCookie(event, "refresh_token", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

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
    return await createUser(input, event);
  },
});
