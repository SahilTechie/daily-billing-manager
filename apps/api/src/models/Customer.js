import mongoose from "mongoose";

const MODEL_NAME = "Customer";

const customerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    mobile: { type: String, required: true, trim: true, index: true },
    address: { type: String, default: "" },
    currentBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const getCustomerModel = (connection) => {
  return connection.models[MODEL_NAME] || connection.model(MODEL_NAME, customerSchema);
};

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, customerSchema);
