import prisma from "~/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createApiHandler } from "~/lib/utils/api-helpers";

const registerUserSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(3).max(30),
  password: z.string().min(6).max(30),
  email: z.string().email(),
});

type RegisterUserInput = z.infer<typeof registerUserSchema>;

async function createUser(userData: RegisterUserInput) {
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

  // Return only safe fields (exclude password)
  const { password, ...safeUser } = newUser;
  return safeUser;
}

export default createApiHandler({
  schema: registerUserSchema,
  handler: async (input) => {
    return await createUser(input);
  },
});
