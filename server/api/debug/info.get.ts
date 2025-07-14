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
    };

    // Check database connection
    let dbStatus = "✗ Error";
    let dbError = null;
    try {
      const prisma = (await import("~/lib/prisma")).default;
      // For MongoDB, use a simple operation instead of $queryRaw
      await prisma.user.findFirst({ take: 1 });
      dbStatus = "✓ Connected";
    } catch (error) {
      console.error("Database connection error:", error);
      dbError = error instanceof Error ? error.message : "Unknown error";
      dbStatus = `✗ Error: ${dbError}`;
    }

    // Check JWT functionality
    let jwtStatus = "✗ Error";
    let jwtError = null;
    try {
      const { generateTokenPair } = await import("~/lib/auth/jwt");
      const testPayload = {
        userId: "test",
        email: "test@example.com",
        username: "test",
      };
      generateTokenPair(testPayload);
      jwtStatus = "✓ Working";
    } catch (error) {
      console.error("JWT error:", error);
      jwtError = error instanceof Error ? error.message : "Unknown error";
      jwtStatus = `✗ Error: ${jwtError}`;
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
      jwt: {
        status: jwtStatus,
        error: jwtError,
      },
      server: {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
      },
    };
  } catch (error) {
    console.error("Debug info error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Debug info failed",
      data: { error: error instanceof Error ? error.message : "Unknown error" },
    });
  }
});
