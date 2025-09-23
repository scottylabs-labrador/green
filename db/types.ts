export type Splits = Record<string, number>;

export interface GroceryItem {
  name: string;
  quantity: number;
  splits: Splits;
}

export type GroceryItems = Record<string, GroceryItem>;

export interface ReceiptItem {
  receiptItem: string;
  groceryItem: string;
  price: string;
  splits: Splits;
}

export type ReceiptItems = Record<string, ReceiptItem>;

export interface Invite {
  houseId: string;
  createdAt: number;
  expiresAt: number;
}
