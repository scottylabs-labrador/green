import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import * as schema from "./classes";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  // databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_DB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export function writeUserData(name, email, phone_number) {
  const db = getDatabase();
  const postListRef = ref(db, 'housemates/');
  const newPostRef = push(postListRef);
  const user = new schema.Housemate(newPostRef.key, name, email, phone_number);
  set(newPostRef, {
    name: user.name,
    email: user.email,
    phone_number: user.phone_number, 
    houses: user.house_ids
  });
}

export function writeGroceryItem(name, quantity=1) {
  const db = getDatabase();
  const item = new schema.GroceryItem(name, quantity);
  const postListRef = ref(db, 'groceryitems/');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: item.name,
    quantity: item.quantity,
    splits: item.splits
  });
}

export function readGroceryItems() {
  const db = getDatabase();
  const itemRef = ref(db, 'groceryitems/');
  onValue(itemRef, (snapshot) => {
    const data = snapshot.val();
    return data;
  })
}

export function writeHouseData(name, housecode) {
  const db = getDatabase();
  const house = new schema.House(name);
  const postListRef = ref(db, 'houses/'+ housecode);
  set(postListRef, {
    name: house.name,
    members: house.members
  })
  return postListRef;
}

