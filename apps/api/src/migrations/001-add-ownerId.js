import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Bill from "../models/Bill.js";
import Payment from "../models/Payment.js";

const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bill-management";

async function runMigration() {
  try {
    // Connect to database
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    // Get or find the default owner
    let owner = await User.findOne({ username: "owner" });
    if (!owner) {
      console.warn("Default owner not found! Creating one...");
      const bcrypt = await import("bcryptjs");
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const passwordHash = await bcrypt.default.hash("owner123", saltRounds);
      owner = await User.create({
        username: "owner",
        email: "owner@shop.local",
        passwordHash,
        shopName: "Chicken Shop",
      });
      console.log("Default owner created");
    }

    const ownerId = owner._id;
    console.log(`Using owner ID: ${ownerId}`);

    // Migrate customers: add ownerId to all customers that don't have it
    const customersWithoutOwnerId = await Customer.find({ ownerId: { $exists: false } });
    if (customersWithoutOwnerId.length > 0) {
      await Customer.updateMany(
        { ownerId: { $exists: false } },
        { ownerId }
      );
      console.log(`✓ Updated ${customersWithoutOwnerId.length} customers with ownerId`);
    } else {
      console.log("✓ All customers already have ownerId");
    }

    // Migrate bills: add ownerId to all bills that don't have it
    const billsWithoutOwnerId = await Bill.find({ ownerId: { $exists: false } });
    if (billsWithoutOwnerId.length > 0) {
      await Bill.updateMany(
        { ownerId: { $exists: false } },
        { ownerId }
      );
      console.log(`✓ Updated ${billsWithoutOwnerId.length} bills with ownerId`);
    } else {
      console.log("✓ All bills already have ownerId");
    }

    // Migrate payments: add ownerId to all payments that don't have it
    const paymentsWithoutOwnerId = await Payment.find({ ownerId: { $exists: false } });
    if (paymentsWithoutOwnerId.length > 0) {
      await Payment.updateMany(
        { ownerId: { $exists: false } },
        { ownerId }
      );
      console.log(`✓ Updated ${paymentsWithoutOwnerId.length} payments with ownerId`);
    } else {
      console.log("✓ All payments already have ownerId");
    }

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

runMigration();
