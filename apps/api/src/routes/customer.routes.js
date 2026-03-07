import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { Customer } = req.tenantModels;
  const { name, mobile, address = "" } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: "Name and mobile are required" });
  }

  const customer = await Customer.create({ 
    ownerId: req.user.id,
    name, 
    mobile, 
    address 
  });
  return res.status(201).json({ success: true, data: customer });
});

router.get("/", async (req, res) => {
  const { Customer } = req.tenantModels;
  const q = req.query.q?.trim();
  const filter = { ownerId: req.user.id };
  
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { mobile: { $regex: q, $options: "i" } },
    ];
  }

  const customers = await Customer.find(filter).sort({ createdAt: -1 });
  return res.json({ success: true, data: customers });
});

router.get("/:id", async (req, res) => {
  const { Customer, Bill, Payment } = req.tenantModels;
  const customer = await Customer.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  const [bills, payments] = await Promise.all([
    Bill.find({ customerId: customer._id, ownerId: req.user.id }).sort({ date: -1 }),
    Payment.find({ customerId: customer._id, ownerId: req.user.id }).sort({ date: -1 }),
  ]);

  const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = bills.reduce((sum, bill) => sum + bill.balanceAmount, 0);

  return res.json({
    success: true,
    data: {
      customer,
      bills,
      payments,
      summary: {
        totalBilled,
        totalPaid,
        pending: Math.max(0, Number(pending.toFixed(2))),
      },
    },
  });
});

export default router;
