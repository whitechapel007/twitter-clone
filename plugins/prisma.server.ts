// This plugin ensures Prisma is only loaded on the server side
export default defineNitroPlugin(async (nitroApp) => {
  // Only run on server side
  if (process.server) {
    try {
      // Import Prisma client dynamically to avoid build issues
      const { default: prisma } = await import("~/lib/prisma");
      
      // Test connection
      await prisma.$connect();
      console.log("✅ Prisma connected successfully");
      
      // Handle graceful shutdown
      nitroApp.hooks.hook("close", async () => {
        await prisma.$disconnect();
        console.log("🔌 Prisma disconnected");
      });
    } catch (error) {
      console.error("❌ Prisma connection failed:", error);
    }
  }
});
