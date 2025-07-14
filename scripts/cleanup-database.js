#!/usr/bin/env node

import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

async function cleanupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);

  try {
    console.log('🔍 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('User');

    console.log('🔍 Checking all users...');
    const allUsers = await collection.find({}).toArray();
    console.log(`Found ${allUsers.length} total users`);

    let fixedCount = 0;

    for (const user of allUsers) {
      let needsUpdate = false;
      const updates = {};

      // Check dob field
      if (user.dob === null || user.dob === undefined) {
        console.log(`Fixing null dob for user: ${user.email}`);
        updates.dob = new Date('1990-01-01T00:00:00.000Z');
        needsUpdate = true;
      } else if (typeof user.dob === 'string') {
        console.log(`Converting string dob for user: ${user.email} - "${user.dob}"`);
        updates.dob = new Date(user.dob);
        needsUpdate = true;
      } else if (user.dob && typeof user.dob === 'object' && user.dob.$date) {
        console.log(`Converting $date object for user: ${user.email}`);
        updates.dob = new Date(user.dob.$date);
        needsUpdate = true;
      }

      // Check createdAt field
      if (user.createdAt === null || user.createdAt === undefined) {
        console.log(`Fixing null createdAt for user: ${user.email}`);
        updates.createdAt = new Date();
        needsUpdate = true;
      } else if (typeof user.createdAt === 'string') {
        console.log(`Converting string createdAt for user: ${user.email}`);
        updates.createdAt = new Date(user.createdAt);
        needsUpdate = true;
      }

      // Check updatedAt field
      if (user.updatedAt === null || user.updatedAt === undefined) {
        console.log(`Fixing null updatedAt for user: ${user.email}`);
        updates.updatedAt = new Date();
        needsUpdate = true;
      } else if (typeof user.updatedAt === 'string') {
        console.log(`Converting string updatedAt for user: ${user.email}`);
        updates.updatedAt = new Date(user.updatedAt);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await collection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        fixedCount++;
        console.log(`✅ Fixed user: ${user.email}`);
      }
    }

    console.log(`🎉 Database cleanup complete! Fixed ${fixedCount} users.`);

    // Verify the cleanup
    console.log('🔍 Verifying cleanup...');
    const verifyUsers = await collection.find({}).limit(3).toArray();
    
    for (const user of verifyUsers) {
      console.log(`User: ${user.email}`);
      console.log(`  dob: ${user.dob} (${typeof user.dob})`);
      console.log(`  createdAt: ${user.createdAt} (${typeof user.createdAt})`);
      console.log(`  updatedAt: ${user.updatedAt} (${typeof user.updatedAt})`);
    }

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Main execution
console.log('🧹 Database Cleanup Script');
console.log('This will fix all date field issues in the database');
console.log('');

cleanupDatabase();
