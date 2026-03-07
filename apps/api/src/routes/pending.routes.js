import express from "express";
import { getCollectionScore } from "../utils/scoring.js";

const router = express.Router();

const dayDiff = (fromDate, toDate = new Date()) => {
  if (!fromDate) return 0;
  const ms = toDate.getTime() - new Date(fromDate).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
};

router.get("/", async (req, res) => {
  const { Bill, Payment, Customer } = req.tenantModels;
  const sort = req.query.sort === "lowest" ? "lowest" : "highest";

  const customers = await Customer.find({ 
    ownerId: req.user.id,
    currentBalance: { $gt: 0 } 
  }).lean();

  const enriched = await Promise.all(
    customers.map(async (customer) => {
      const [lastPayment, lastBill] = await Promise.all([
        Payment.findOne({ 
          customerId: customer._id,
          ownerId: req.user.id,
        }).sort({ date: -1 }).select("date"),
        Bill.findOne({ 
          customerId: customer._id,
          ownerId: req.user.id,
        }).sort({ date: -1 }).select("date"),
      ]);

      const daysSinceLastPayment = dayDiff(lastPayment?.date);
      const daysSinceLastBill = dayDiff(lastBill?.date);
      const { score, priorityBucket } = getCollectionScore({
        pendingAmount: customer.currentBalance,
        daysSinceLastPayment,
        daysSinceLastBill,
      });

      return {
        ...customer,
        score,
        priorityBucket,
      };
    })
  );

  enriched.sort((a, b) =>
    sort === "highest" ? b.currentBalance - a.currentBalance : a.currentBalance - b.currentBalance
  );

  const totalPending = enriched.reduce((sum, item) => sum + item.currentBalance, 0);

  return res.json({
    success: true,
    data: {
      sort,
      totalPending,
      customers: enriched,
    },
  });
});

export default router;
