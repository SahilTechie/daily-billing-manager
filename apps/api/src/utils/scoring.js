export const getCollectionScore = ({ pendingAmount, daysSinceLastPayment = 0, daysSinceLastBill = 0 }) => {
  const base = Math.min(100, Math.round((pendingAmount / 5000) * 100));
  const paymentDelayBonus = Math.min(20, Math.floor(daysSinceLastPayment / 7));
  const billRecencyBonus = Math.min(10, Math.floor(daysSinceLastBill / 15));

  const score = Math.min(100, base + paymentDelayBonus + billRecencyBonus);
  let priorityBucket = "Low";

  if (score >= 80) priorityBucket = "High";
  else if (score >= 50) priorityBucket = "Medium";

  return { score, priorityBucket };
};
