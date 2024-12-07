import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, remove, orderByChild, query, equalTo, get } from "firebase/database";
import * as schema from "./classes";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  // databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
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

export function writeGroceryItem(name, quantity=1, splits=[]) {
  const db = getDatabase();
  const item = new schema.GroceryItem(name, quantity, splits);
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

interface GroceryItem {
  name: string;
  quantity: number;
  splits?: string[];
}

export function removeGroceryItem(name, quantity, splits=[]) {
  const db = getDatabase();
  const itemRef = ref(db, 'groceryitems/'); 

  get(itemRef).then((snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.val() as Record<string, GroceryItem>; // Assert the type
      console.log('val: ', items);

      Object.entries(items).forEach(([key, item]) => {
        // Check if the name matches and quantity is 0
        if (item.name === name && item.quantity === quantity + 1) {
          const itemRef = ref(db, `groceryitems/${key}`);
          remove(itemRef) // Remove the item
            .then(() => console.log(`Removed item: ${name}`))
            .catch((error) => console.error('Error removing item:', error));
        }
      });
    } else {
      console.log('No matching items found');
    }
  })
}

export function writeHouseData(name) {
  const db = getDatabase();
  const house = new schema.House(name);
  const postListRef = ref(db, 'houses/');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: house.name,
  });
}

