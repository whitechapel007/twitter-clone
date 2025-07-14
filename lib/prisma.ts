import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      errorFormat: "pretty",
    });
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    throw error;
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Ensure proper cleanup on process termination
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;

  // Handle graceful shutdown
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
