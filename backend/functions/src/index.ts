import * as admin from 'firebase-admin';

const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

if (isEmulator) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = 'localhost:9000';
}

admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
});

import { clearGroceryItems, removeGroceryItem, updateGroceryItem, writeGroceryItem, writeGroceryList } from './handlers/grocerylist';
import { createInviteCode, deleteExpiredInviteCodes, getHouseNameFromServer, joinHouse, removeMember, updateHouseName, updateOwner, writeHouse } from './handlers/house';
import { deleteReceiptItem, updateReceiptItem, writeReceipt } from './handlers/receipt';
import { getUserEmail, syncUserName, updateUser, updateUserColor, writeUser } from './handlers/user';

exports.writeGroceryList = writeGroceryList;
exports.writeGroceryItem = writeGroceryItem;
exports.updateGroceryItem = updateGroceryItem;
exports.removeGroceryItem = removeGroceryItem
exports.clearGroceryItems = clearGroceryItems

exports.createInviteCode = createInviteCode;
exports.joinHouse = joinHouse;
exports.writeHouse = writeHouse;
exports.deleteExpiredInviteCodes = deleteExpiredInviteCodes;
exports.updateHouseName = updateHouseName;
exports.getHouseNameFromServer = getHouseNameFromServer;
exports.updateOwner = updateOwner;
exports.removeMember = removeMember;

exports.writeReceipt = writeReceipt;
exports.updateReceiptItem = updateReceiptItem;
exports.deleteReceiptItem = deleteReceiptItem;

exports.writeUser = writeUser;
exports.updateUser = updateUser;
exports.syncUserName = syncUserName;
exports.updateUserColor = updateUserColor;
exports.getUserEmail = getUserEmail;
