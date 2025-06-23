import { z } from "zod";
import { createApiHandler } from "~/lib/utils/api-helpers";
import { verifyRefreshToken, generateTokenPair } from "~/lib/auth/jwt";
import prisma from "~/lib/prisma";
import type { EventHandlerRequest, H3Event } from "h3";
import { getCookie, setCookie } from "h3";

const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

type RefreshTokenInput = z.infer<typeof refreshSchema>;

async function refreshTokens(
  data: RefreshTokenInput,
  event: H3Event<EventHandlerRequest>
) {
  // Try to get refresh token from request body or cookies
  let refreshToken = data.refreshToken;
  if (!refreshToken) {
    refreshToken = getCookie(event, "refresh_token") || "";
  }

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Refresh token required",
      data: { error: "NO_REFRESH_TOKEN" },
    });
  }

  // Verify the refresh token
  const payload = verifyRefreshToken(refreshToken);

  // Verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
      data: { error: "USER_NOT_FOUND" },
    });
  }

  // Generate new token pair
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username || "",
  };

  const tokens = generateTokenPair(tokenPayload);

  // Update refresh token in database
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

  return {
    message: "Tokens refreshed successfully",
    accessToken: tokens.accessToken,
  };
}

export default createApiHandler({
  schema: refreshSchema,
  handler: async (input, event) => {
    return await refreshTokens(input, event);
  },
});
