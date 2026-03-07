import express from "express";
import { recalculateCustomerBalance } from "../utils/balance.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { Payment, Customer, Bill } = req.tenantModels;
  const { customerId, billId, amount, date } = req.body;

  if (!customerId || amount == null) {
    return res.status(400).json({ success: false, message: "customerId and amount are required" });
  }

  const numericAmount = Number(amount);
  if (numericAmount <= 0) {
    return res.status(400).json({ success: false, message: "Amount must be greater than zero" });
  }

  const customer = await Customer.findOne({
    _id: customerId,
    ownerId: req.user.id,
  });
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  if (billId) {
    const bill = await Bill.findOne({
      _id: billId,
      customerId,
      ownerId: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    if (numericAmount > bill.balanceAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot exceed due amount of Rs. ${bill.balanceAmount.toFixed(2)}`,
      });
    }

    bill.balanceAmount = Number((bill.balanceAmount - numericAmount).toFixed(2));
    await bill.save();
  } else {
    const pendingBills = await Bill.find({
      customerId,
      ownerId: req.user.id,
      balanceAmount: { $gt: 0 },
    }).sort({ date: 1, billNumber: 1 });

    const totalOutstanding = pendingBills.reduce((sum, item) => sum + item.balanceAmount, 0);
    if (numericAmount > totalOutstanding) {
      return res.status(400).json({
        success: false,
        message: `Payment cannot exceed total due amount of Rs. ${totalOutstanding.toFixed(2)}`,
      });
    }

    let remaining = numericAmount;
    for (const pendingBill of pendingBills) {
      if (remaining <= 0) break;
      const applied = Math.min(remaining, pendingBill.balanceAmount);
      pendingBill.balanceAmount = Number((pendingBill.balanceAmount - applied).toFixed(2));
      remaining = Number((remaining - applied).toFixed(2));
      await pendingBill.save();
    }
  }

  const payment = await Payment.create({
    ownerId: req.user.id,
    customerId,
    amount: numericAmount,
    date: date ? new Date(date) : new Date(),
  });

  await recalculateCustomerBalance({
    customerId: customer._id,
    BillModel: Bill,
    CustomerModel: Customer,
  });
  return res.status(201).json({ success: true, data: payment });
});

export default router;
