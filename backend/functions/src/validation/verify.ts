import { exists, get } from '../db/db';

export const houseExists = async (houseId: string) => {
  if (!houseId) {
    return false;
  }
  
  return await exists(`houses/${houseId}`);
}

export const userInHouse = async (uid: string, houseId: string) => {
  if (!uid || !houseId) {
    return false;
  }

  const inHouse = await exists(`houses/${houseId}/members/${uid}`);
  return inHouse;
}

export const groceryListInHouse = async (groceryListId: string, houseId: string) => {
  if (!groceryListId || !houseId) {
    return false;
  }

  try {
    const groceryList = await get(`houses/${houseId}/grocerylist`);
    return groceryListId === groceryList;
  } catch (e) {
    return false;
  }
}

export const receiptInHouse = async (receiptId: string, houseId: string) => {
  if (!receiptId || !houseId) {
    return false;
  }

  const inHouse = await exists(`houses/${houseId}/receipts/${receiptId}`);
  return inHouse;
}

export const isValidHexColor = (color: string) => {
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return hexRegex.test(color);
}