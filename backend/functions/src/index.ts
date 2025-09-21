import * as admin from "firebase-admin";

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (isEmulator) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = "localhost:9000";
}

admin.initializeApp({
  databaseURL: isEmulator 
    ? "http://localhost:9000?ns=green-2c431-default-rtdb"
    : "https://green-2c431.firebaseio.com",
});

import { createInviteCode } from "./handlers/house";

exports.createInviteCode = createInviteCode;


