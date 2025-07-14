#!/usr/bin/env node

import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "..", ".env") });

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log("🔍 Checking database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    console.log("🔍 Checking for users with invalid dob...");

    // Check for users with string dates instead of proper Date objects
    const usersWithStringDates = await prisma.$runCommandRaw({
      find: "User",
      filter: { dob: { $type: "string" } },
      projection: { _id: 1, email: 1, username: 1, dob: 1 },
    });

    const stringDateUsers = usersWithStringDates.cursor?.firstBatch || [];
    console.log(`Found ${stringDateUsers.length} users with string dates`);

    if (stringDateUsers.length > 0) {
      console.log("🔧 Fixing users with string dates...");

      for (const userDoc of stringDateUsers) {
        console.log(
          `Fixing user: ${userDoc.email} (${userDoc.username}) - current dob: ${userDoc.dob}`
        );

        // Convert string date to proper Date object
        const properDate = new Date(userDoc.dob);

        await prisma.$runCommandRaw({
          update: "User",
          updates: [
            {
              q: { _id: userDoc._id },
              u: { $set: { dob: properDate } },
            },
          ],
        });
      }

      console.log("✅ Fixed all users with string dates");
    }

    // Also check for null dob values
    const usersWithNullDob = await prisma.$runCommandRaw({
      find: "User",
      filter: { dob: null },
      projection: { _id: 1, email: 1, username: 1, dob: 1 },
    });

    const nullDobUsers = usersWithNullDob.cursor?.firstBatch || [];
    console.log(`Found ${nullDobUsers.length} users with null dob`);

    if (nullDobUsers.length > 0) {
      console.log("🔧 Fixing users with null dob...");

      // Set a default date for users with null dob (e.g., January 1, 1990)
      const defaultDate = new Date("1990-01-01T00:00:00.000Z");

      for (const userDoc of nullDobUsers) {
        console.log(`Fixing user: ${userDoc.email} (${userDoc.username})`);

        await prisma.$runCommandRaw({
          update: "User",
          updates: [
            {
              q: { _id: userDoc._id },
              u: { $set: { dob: defaultDate } },
            },
          ],
        });
      }

      console.log("✅ Fixed all users with null dob");
    }

    console.log("🔍 Verifying database integrity...");

    // Test a simple query to make sure everything works
    const userCount = await prisma.user.count();
    console.log(`✅ Database verification complete. Total users: ${userCount}`);
  } catch (error) {
    console.error("❌ Database fix failed:", error);

    if (error.code === "P1001") {
      console.error(
        "💡 Database server is not reachable. Please check your DATABASE_URL and ensure MongoDB is running."
      );
    } else if (error.code === "P1000") {
      console.error(
        "💡 Database authentication failed. Please check your DATABASE_URL credentials."
      );
    } else {
      console.error("💡 Error details:", error.message);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function checkEnvironment() {
  console.log("🔧 Environment Check:");
  console.log("NODE_ENV:", process.env.NODE_ENV || "development");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "✓ Set" : "✗ Missing"
  );
  console.log(
    "ACCESS_TOKEN_SECRET:",
    process.env.ACCESS_TOKEN_SECRET ? "✓ Set" : "✗ Missing"
  );
  console.log(
    "REFRESH_TOKEN_SECRET:",
    process.env.REFRESH_TOKEN_SECRET ? "✓ Set" : "✗ Missing"
  );
  console.log("");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Please check your .env file.");
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "fix":
    checkEnvironment();
    fixDatabase();
    break;
  case "check":
    checkEnvironment();
    break;
  default:
    console.log("Database Fix Script");
    console.log("");
    console.log("Usage:");
    console.log("  node scripts/fix-database.js fix   - Fix database issues");
    console.log(
      "  node scripts/fix-database.js check - Check environment only"
    );
    console.log("");
    console.log("This script will:");
    console.log("  - Check database connection");
    console.log("  - Fix users with null dob values");
    console.log("  - Verify database integrity");
}
