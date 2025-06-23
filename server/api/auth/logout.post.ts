import { createApiHandler } from "~/lib/utils/api-helpers";
import { withAuth } from "~/lib/auth/middleware";
import type { EventHandlerRequest, H3Event } from "h3";
import type { TokenPayload } from "~/lib/auth/jwt";
import prisma from "~/lib/prisma";

async function logoutUser(
  _input: {},
  event: H3Event<EventHandlerRequest>,
  user: TokenPayload
) {
  // Clear HTTP-only cookies
  deleteCookie(event, "access_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  deleteCookie(event, "refresh_token", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Remove refresh token from database
  await prisma.user.update({
    where: { id: user.userId },
    data: {
      refreshToken: null,
    },
  });

  return {
    message: "Logged out successfully",
    userId: user.userId,
    timestamp: new Date().toISOString(),
  };
}

export default createApiHandler({
  handler: withAuth(logoutUser),
});
