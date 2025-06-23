import { z } from "zod";
import { createApiHandler } from "~/lib/utils/api-helpers";
import prisma from "~/lib/prisma";

const createTweetSchema = z.object({
  content: z.string().min(1).max(280),
});

type CreateTweetInput = z.infer<typeof createTweetSchema>;

async function createTweet(data: CreateTweetInput, event: any) {
  // Get user from middleware context
  const user = event.context.user;
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const tweet = await prisma.tweet.create({
    data: {
      content: data.content,
      authorId: user.userId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  return {
    message: "Tweet created successfully",
    tweet,
  };
}

export default createApiHandler({
  schema: createTweetSchema,
  handler: async (input, event) => {
    return await createTweet(input, event);
  },
});
