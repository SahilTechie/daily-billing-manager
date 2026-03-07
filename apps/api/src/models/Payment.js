import mongoose from "mongoose";

const MODEL_NAME = "Payment";

const paymentSchema = new mongoose.Schema(
  {
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
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const getPaymentModel = (connection) => {
  return connection.models[MODEL_NAME] || connection.model(MODEL_NAME, paymentSchema);
};

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, paymentSchema);
