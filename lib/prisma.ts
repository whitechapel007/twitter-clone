// ~/lib/prisma.ts
// Server utilities are auto-imported in all server contexts

import { PrismaClient } from "@prisma/client";

// Declare global type for Prisma instance
declare global {
  var __prisma__: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
// This prevents multiple instances in development due to hot reloading
const prisma = globalThis.__prisma__ || new PrismaClient();

// In development, store the instance globally to prevent multiple connections
if (process.env.NODE_ENV === "development") {
  globalThis.__prisma__ = prisma;
}

// Export the Prisma client for use in server contexts
export { prisma };

// Also export as a function for consistency with usePrismaClient pattern
export function usePrismaClient() {
  return prisma;
}
