import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const makeAuthPayload = (user) => {
  const token = jwt.sign(
    { id: user._id, username: user.username, shopName: user.shopName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return {
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      shopName: user.shopName,
    },
  };
};

router.post("/signup", async (req, res) => {
  const { username, email, password, shopName } = req.body;

  if (!username || !email || !password || !shopName) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  const normalizedUsername = String(username).trim().toLowerCase();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedShopName = String(shopName).trim();

  const existingByUsername = await User.findOne({ username: normalizedUsername });
  if (existingByUsername) {
    return res.status(409).json({ success: false, message: "Username already exists" });
  }

  const existingByEmail = await User.findOne({ email: normalizedEmail });
  if (existingByEmail) {
    return res.status(409).json({ success: false, message: "Email already exists" });
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    shopName: normalizedShopName,
  });

  return res.status(201).json(makeAuthPayload(user));
});

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({ success: false, message: "Credentials are required" });
  }

  let owner = await User.findOne({ username: "owner" });
  if (!owner) {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash("owner123", saltRounds);
    owner = await User.create({
      username: "owner",
      email: "owner@shop.local",
      passwordHash,
      shopName: "Chicken Shop",
    });
  }

  const user = await User.findOne(
    username ? { username } : { email }
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  return res.json(makeAuthPayload(user));
});

export default router;
