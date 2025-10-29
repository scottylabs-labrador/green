import { ReceiptItems } from "@db/types";

export const calculateSplits = (receiptItems: ReceiptItems) => {
  if (!receiptItems) {
    return {};
  }

  let splitPrices: Record<string, number> = {};

  for (const itemId in receiptItems) {
    const item = receiptItems[itemId];
    const price = item.price || 0;
    const splits = item.splits || {};
    
    let totalSplitCount = 0;
    for (const userId in splits) {
      totalSplitCount += splits[userId];
    }

    for (const userId in splits) {
      const userSplitCount = splits[userId];
      const splitPrice = parseFloat(((price * userSplitCount) / totalSplitCount).toFixed(2));
      if (userId in splitPrices) {
        splitPrices[userId] = splitPrices[userId] + splitPrice;
      } else {
        splitPrices[userId] = splitPrice;
      }
    }
  }
  
  return splitPrices;
};
