export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    console.log("Test registration endpoint called with:", body);

    // Basic validation
    if (!body.email || !body.password || !body.username || !body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
        data: {
          error: "Missing required fields: email, password, username, name",
        },
      });
    }

    // Test database connection
    let dbTest = "✗ Failed";
    try {
      const prisma = (await import("~/lib/prisma")).default;
      // For MongoDB, use a simple operation instead of $queryRaw
      await prisma.user.findFirst({ take: 1 });
      dbTest = "✓ Connected";
    } catch (dbError) {
      console.error("Database test failed:", dbError);
      throw createError({
        statusCode: 503,
        statusMessage: "Database connection failed",
        data: {
          error: "Database unavailable",
          details:
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error",
        },
      });
    }

    // Test JWT generation
    let jwtTest = "✗ Failed";
    try {
      const { generateTokenPair } = await import("~/lib/auth/jwt");
      const testTokens = generateTokenPair({
        userId: "test-id",
        email: body.email,
        username: body.username,
      });
      jwtTest = "✓ Generated";
    } catch (jwtError) {
      console.error("JWT test failed:", jwtError);
      throw createError({
        statusCode: 500,
        statusMessage: "JWT generation failed",
        data: {
          error: "JWT system unavailable",
          details:
            jwtError instanceof Error ? jwtError.message : "Unknown JWT error",
        },
      });
    }

    return {
      message: "Test registration endpoint working",
      timestamp: new Date().toISOString(),
      tests: {
        database: dbTest,
        jwt: jwtTest,
        validation: "✓ Passed",
      },
      receivedData: {
        email: body.email,
        username: body.username,
        name: body.name,
        hasPassword: !!body.password,
        hasDob: !!body.dob,
      },
    };
  } catch (error) {
    console.error("Test registration error:", error);

    // If it's already an H3Error, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: "Test registration failed",
      data: {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
});
