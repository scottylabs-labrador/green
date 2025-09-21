import * as crypto from "crypto";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const createInviteCode = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string }>) => {
    const { houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError("unauthenticated", "You must be logged in");
    }

    if (!houseId) {
      throw new functions.https.HttpsError("invalid-argument", "houseId is required");
    }

    const randomBytes = crypto.randomBytes(4);
    const token = Array.from(randomBytes)
      .map((b) => b.toString(36).padStart(2, "0"))
      .join("");

    const now = Date.now();
    const expiresAt = now + 1000 * 60 * 60 * 24;

    const db = admin.database();
    await db.ref(`invites/${token}`).set({
      houseId,
      createdAt: now,
      expiresAt,
    });

    return { token };
  }
);

// const corsHandler = cors({ origin: true });

// export const createInviteCode = functions.https.onRequest((req, res) => {
//   return corsHandler(req, res, async () => {
//     try {
//       if (req.method !== "POST") {
//         return res.status(405).send("Method Not Allowed");
//       }

//       const authHeader = req.headers.authorization || "";
//       const match = authHeader.match(/^Bearer (.*)$/);

//       if (!match) {
//         return res.status(401).json({ error: "Unauthorized: Missing token" });
//       }

//       const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

//       let decoded: any;
//       if (isEmulator) {
//         // Auth Emulator does not verify token, so just parse it or mock it
//         decoded = { uid: authHeader.replace("Bearer ", "") };
//       } else {
//         decoded = await admin.auth().verifyIdToken(match[1]);
//       }

//       const { houseId } = req.body;
//       if (!houseId) {
//         return res.status(400).json({ error: "houseId is required" });
//       }

//       const randomBytes = crypto.randomBytes(4);
//       const token = Array.from(randomBytes)
//         .map((b) => b.toString(36).padStart(2, "0"))
//         .join("");

//       const now = Date.now();
//       const expiresAt = now + 1000 * 60 * 60 * 24;

//       const db = admin.database();
//       await db.ref(`invites/${token}`).set({
//         houseId,
//         createdAt: now,
//         expiresAt,
//       });

//       return res.json({ token });
//     } catch (err) {
//       console.error("Error in createInviteCode:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// });
