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

import { createInviteCode, joinHouseWithInvite, writeHouse } from './handlers/house';
import { writeGroceryList, writeGroceryItem, updateGroceryItem } from './handlers/grocerylist';

exports.writeGroceryList = writeGroceryList;
exports.writeGroceryItem = writeGroceryItem;
exports.updateGroceryItem = updateGroceryItem;
exports.createInviteCode = createInviteCode;
exports.joinHouseWithInvite = joinHouseWithInvite;
exports.writeHouse = writeHouse;
