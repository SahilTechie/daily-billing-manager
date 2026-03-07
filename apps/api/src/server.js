import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from monorepo root (Bill/.env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import { auth } from "./middleware/auth.js";
import { tenantDb } from "./middleware/tenantDb.js";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import billRoutes from "./routes/bill.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import pendingRoutes from "./routes/pending.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", auth, tenantDb, customerRoutes);
app.use("/api/bills", auth, tenantDb, billRoutes);
app.use("/api/payments", auth, tenantDb, paymentRoutes);
app.use("/api/dashboard", auth, tenantDb, dashboardRoutes);
app.use("/api/pending", auth, tenantDb, pendingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const seedDefaultOwner = async () => {
  const existing = await User.findOne({ username: "owner" });
  if (existing) return;

  const hash = await bcrypt.hash("owner123", Number(process.env.BCRYPT_SALT_ROUNDS || 10));
  await User.create({
    username: "owner",
    email: "owner@shop.local",
    passwordHash: hash,
    shopName: "Chicken Shop",
  });
  console.log("Default owner created (owner / owner123)");
};

const start = async () => {
  await connectDB();
  await seedDefaultOwner();

  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
};

start().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
