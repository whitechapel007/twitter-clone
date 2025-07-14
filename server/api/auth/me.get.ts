import { createApiHandler } from "~/lib/utils/api-helpers";
import { withAuth } from "~/lib/auth/middleware";
import prisma from "~/lib/prisma";
import type { TokenPayload } from "~/lib/auth/jwt";
import type { H3Event, EventHandlerRequest } from "h3";

async function getCurrentUser(
  _input: Record<string, never>,
  _event: H3Event<EventHandlerRequest>,
  user: TokenPayload
) {
  // Get fresh user data from database
  const currentUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
      // Don't include password or refreshToken for security
    },
  });

  if (!currentUser) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
      data: {
        error: "USER_NOT_FOUND",
        details: "The authenticated user no longer exists in the database",
      },
    });
  }

  // Transform the user data to match the frontend User interface
  const userResponse = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    username: currentUser.username,
    avatar: currentUser.profileImage,
    createdAt: currentUser.createdAt.toISOString(),
  };

  return {
    user: userResponse,
    tokenInfo: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      issuedAt: new Date().toISOString(),
    },
  };
}

export default createApiHandler({
  handler: withAuth(getCurrentUser),
});
