import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
  const { Bill, Customer } = _req.tenantModels;
  const userId = _req.user.id;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const [todayBillsCount, todayBills, totalCustomers, pendingAgg] = await Promise.all([
    Bill.countDocuments({ ownerId: userId, date: { $gte: start, $lte: end } }),
    Bill.find({ ownerId: userId, date: { $gte: start, $lte: end } }),
    Customer.countDocuments({ ownerId: userId }),
    Customer.aggregate([
      { $match: { ownerId: userId } },
      { $group: { _id: null, totalPending: { $sum: "$currentBalance" } } }
    ]),
  ]);

  const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  return res.json({
    success: true,
    data: {
      todayBills: todayBillsCount,
      todayRevenue,
      totalCustomers,
      totalPending: pendingAgg[0]?.totalPending ?? 0,
    },
  });
});

export default router;
