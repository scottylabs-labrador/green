export type HousemateId = string;

export interface Member {
  name: string;
  color: string;
}

export type Members = Record<HousemateId, Member>;

export interface ReceiptRecordInHouse {
  date: string;
}

export type ReceiptRecordsInHouse = Record<string, ReceiptRecordInHouse>;

export interface House {
  name: string;
  members: Members;
  grocerylist: string;
  receipts: ReceiptRecordsInHouse;
  invite: string;
}

export type Houses = Record<string, House>;

export interface Housemate {
  name: string;
  email: string;
  houses: string[];
}

export type Housemates = Record<HousemateId, Housemate>;

export type Splits = Record<string, number>;

export interface GroceryItem {
  name: string;
  quantity: number;
  splits: Splits;
}

export type GroceryItems = Record<string, GroceryItem>;

export interface GroceryList {
  name: string;
  groceryitems: GroceryItems;
  houseId: string;
}

export type GroceryLists = Record<string, GroceryList>;

export interface ReceiptItem {
  receiptItem: string;
  groceryItem: string;
  price: number;
  splits: Splits;
}

export interface ReceiptItem {
  receiptItem: string;
  groceryItem: string;
  price: number;
  splits: Splits;
}

export type ReceiptItems = Record<string, ReceiptItem>;

export interface Receipt {
  receiptitems: ReceiptItems;
  date: string;
  groceryListId: string;
  houseId: string;
}

export interface Invite {
  houseId: string;
  createdAt: number;
  expiresAt: number;
}

export type Invites = Record<string, Invite>;
