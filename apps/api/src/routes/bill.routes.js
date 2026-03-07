import express from "express";
import { getNextBillNumber, recalculateCustomerBalance } from "../utils/balance.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { Bill, Customer } = req.tenantModels;
  const { customerId, date, birdType, numberOfBirds = 0, weight, rate, advancePaid = 0 } = req.body;

  if (!customerId || !birdType || weight == null || rate == null) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const customer = await Customer.findOne({
    _id: customerId,
    ownerId: req.user.id,
  });
  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  const numericWeight = Number(weight);
  const numericRate = Number(rate);
  const numericAdvance = Number(advancePaid || 0);

  const totalAmount = Number((numericWeight * numericRate).toFixed(2));
  const balanceAmount = Math.max(0, Number((totalAmount - numericAdvance).toFixed(2)));

  const bill = await Bill.create({
    billNumber: await getNextBillNumber(Bill),
    ownerId: req.user.id,
    customerId,
    date: date ? new Date(date) : new Date(),
    birdType,
    numberOfBirds: Number(numberOfBirds || 0),
    weight: numericWeight,
    rate: numericRate,
    totalAmount,
    advancePaid: numericAdvance,
    balanceAmount,
  });

  await recalculateCustomerBalance({
    customerId: customer._id,
    BillModel: Bill,
    CustomerModel: Customer,
  });

  return res.status(201).json({ success: true, data: bill });
});

router.get("/", async (req, res) => {
  const { Bill } = req.tenantModels;
  const { customerId } = req.query;
  const filter = { ownerId: req.user.id };
  
  if (customerId) {
    filter.customerId = customerId;
  }

  const bills = await Bill.find(filter)
    .populate("customerId", "name mobile")
    .sort({ billNumber: -1 });

  return res.json({ success: true, data: bills });
});

router.get("/customer/:customerId", async (req, res) => {
  const { Bill } = req.tenantModels;
  const bills = await Bill.find({ 
    customerId: req.params.customerId,
    ownerId: req.user.id,
  }).sort({ billNumber: -1 });
  return res.json({ success: true, data: bills });
});

router.get("/:id", async (req, res) => {
  const { Bill } = req.tenantModels;
  const bill = await Bill.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  }).populate("customerId", "name mobile address");
  
  if (!bill) {
    return res.status(404).json({ success: false, message: "Bill not found" });
  }
  return res.json({ success: true, data: bill });
});

export default router;
