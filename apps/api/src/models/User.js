import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    shopName: { type: String, default: "Chicken Shop" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
