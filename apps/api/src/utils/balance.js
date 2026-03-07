export const recalculateCustomerBalance = async ({ customerId, BillModel, CustomerModel }) => {
  const [billAgg] = await BillModel.aggregate([
    { $match: { customerId } },
    { $group: { _id: null, total: { $sum: "$balanceAmount" } } },
  ]);

  const currentBalance = Math.max(0, Number((billAgg?.total ?? 0).toFixed(2)));

  await CustomerModel.findByIdAndUpdate(customerId, { currentBalance });
  return currentBalance;
};

export const getNextBillNumber = async (BillModel) => {
  const lastBill = await BillModel.findOne().sort({ billNumber: -1 }).select("billNumber");
  return (lastBill?.billNumber || 0) + 1;
};
