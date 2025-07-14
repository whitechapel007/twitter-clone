export default defineEventHandler(async (_event) => {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
        ? "✓ Set"
        : "✗ Missing",
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
        ? "✓ Set"
        : "✗ Missing",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
        ? "✓ Set"
        : "✗ Missing",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY
        ? "✓ Set"
        : "✗ Missing",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
        ? "✓ Set"
        : "✗ Missing",
    };

    // Check database connection
    let dbStatus = "✗ Error";
    try {
      const prisma = (await import("~/lib/prisma")).default;
      await prisma.$executeRawUnsafe("SELECT 1", []);
      dbStatus = "✓ Connected";
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      dbStatus = `✗ Error: ${
        dbError instanceof Error ? dbError.message : "Unknown error"
      }`;
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      server: {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
    };
  } catch (error) {
    console.error("Health check error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Health check failed",
      data: { error: error instanceof Error ? error.message : "Unknown error" },
    });
  }
});
