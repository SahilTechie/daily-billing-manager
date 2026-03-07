import mongoose from "mongoose";

const MODEL_NAME = "Bill";

const billSchema = new mongoose.Schema(
  {
    billNumber: { type: Number, required: true, unique: true, index: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, default: Date.now, index: true },
    birdType: { type: String, required: true },
    numberOfBirds: { type: Number, default: 0 },
    weight: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    advancePaid: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const getBillModel = (connection) => {
  return connection.models[MODEL_NAME] || connection.model(MODEL_NAME, billSchema);
};

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, billSchema);
