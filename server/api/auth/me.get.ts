import { createApiHandler } from "~/lib/utils/api-helpers";
import { withAuth } from "~/lib/auth/middleware";
import prisma from "~/lib/prisma";

async function getCurrentUser(_input: {}, _event: any, user: any) {
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
    },
  });

  if (!currentUser) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return {
    user: currentUser,
    tokenInfo: {
      userId: user.userId,
      email: user.email,
      username: user.username,
    },
  };
}

export default createApiHandler({
  handler: withAuth(getCurrentUser),
});
