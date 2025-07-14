import { z } from "zod";
import prisma from "~/lib/prisma";
import type { EventHandlerRequest, H3Event } from "h3";
import { readMultipartFormData, defineEventHandler, createError } from "h3";
import { uploadToCloudinary } from "~/utils/cloudinary";
import { withFullErrorHandling } from "~/lib/errors/api-error-handler";
import { withAuth } from "~/lib/auth/middleware";
import type { UploadApiResponse } from "cloudinary";

const createTweetSchema = z.object({
  content: z.string().min(1).max(280),
});

async function createTweet(event: H3Event<EventHandlerRequest>) {
  // Get user from middleware context
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  // Read multipart form data
  const form = await readMultipartFormData(event);

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "No form data provided",
    });
  }

  // Extract content from form data
  const contentPart = form.find((f) => f.name === "content");
  const filePart = form.find((f) => f.name === "file");

  if (!contentPart || !contentPart.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Content is required",
    });
  }

  // Convert buffer to string and validate
  const content = contentPart.data.toString("utf-8");
  const validatedData = createTweetSchema.parse({ content });

  const tweet = await prisma.tweet.create({
    data: {
      content: validatedData.content,
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

  // Upload file to Cloudinary if present
  let mediaUrl: UploadApiResponse | undefined = undefined;
  if (filePart && filePart.data) {
    mediaUrl = await uploadToCloudinary(filePart.data, filePart.filename);
  }

  console.log("Media URL:", mediaUrl);

  // Only create media record if there's actually a media URL
  if (mediaUrl) {
    await prisma.media.create({
      data: {
        url: mediaUrl?.secure_url,
        providerPublicId: mediaUrl?.public_id,
        tweetId: tweet.id,
        userId: user.userId,
      },
    });
  }

  return {
    message: "Tweet created successfully",
    tweet,
  };
}

export default defineEventHandler(async (event) => {
  return withFullErrorHandling(async () => {
    return await withAuth(async (_, event, user) => {
      // Set user in context for the createTweet function
      event.context.user = user;
      return await createTweet(event);
    })(null, event);
  });
});
