import prisma from "~/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createApiHandler } from "~/lib/utils/api-helpers";
import { generateTokenPair } from "~/lib/auth/jwt";
import type { EventHandlerRequest, H3Event } from "h3";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(30),
});

type LoginUserInput = z.infer<typeof loginSchema>;

async function loginUser(
  userData: LoginUserInput,
  event: H3Event<EventHandlerRequest>
) {
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  const passwordMatch = await bcrypt.compare(userData.password, user.password);

  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  // Generate JWT tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username || "",
  };

  const tokens = generateTokenPair(tokenPayload);

  // Update user's refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });

  setCookie(event, "refresh_token", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Return user data with tokens (exclude password)
  const { password,refreshToken, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken: tokens.accessToken,
  };
}

export default createApiHandler({
  schema: loginSchema,
  handler: async (input, event) => {
    return await loginUser(input, event);
  },
});
