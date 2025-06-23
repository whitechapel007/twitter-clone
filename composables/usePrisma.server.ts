// Server-only composable for Prisma
export const usePrisma = () => {
  // This will only be available on the server side
  if (process.server) {
    return import("~/lib/prisma").then(m => m.default);
  }
  
  throw new Error("Prisma can only be used on the server side");
};
