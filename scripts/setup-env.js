#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), ".env");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log(
      "⚠️  .env file already exists. Please check your environment variables manually."
    );
    console.log("Required variables:");
    console.log("- DATABASE_URL");
    console.log("- ACCESS_TOKEN_SECRET");
    console.log("- REFRESH_TOKEN_SECRET");
    return;
  }

  const envContent = `# Database
DATABASE_URL="mongodb://localhost:27017/twitter-clone"

# JWT Secrets (auto-generated)
ACCESS_TOKEN_SECRET="${generateSecret()}"
REFRESH_TOKEN_SECRET="${generateSecret()}"

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Environment
NODE_ENV="development"
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Created .env file with auto-generated JWT secrets");
  console.log("📝 Please update DATABASE_URL if needed");
  console.log(
    "📝 Add Cloudinary credentials if you want image upload functionality"
  );
}

function checkEnvironment() {
  const requiredVars = [
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.log("❌ Missing required environment variables:");
    missing.forEach((varName) => console.log(`   - ${varName}`));
    console.log("\n💡 Run this script to create a .env file with defaults");
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "create":
    createEnvFile();
    break;
  case "check":
    checkEnvironment();
    break;
  default:
    console.log("Environment Setup Script");
    console.log("");
    console.log("Usage:");
    console.log(
      "  node scripts/setup-env.js create  - Create .env file with defaults"
    );
    console.log(
      "  node scripts/setup-env.js check   - Check current environment"
    );
    console.log("");
    console.log("Required environment variables:");
    console.log("  - DATABASE_URL: MongoDB connection string");
    console.log("  - ACCESS_TOKEN_SECRET: Secret for JWT access tokens");
    console.log("  - REFRESH_TOKEN_SECRET: Secret for JWT refresh tokens");
}
