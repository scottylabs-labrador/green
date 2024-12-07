import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, remove, update, orderByChild, query, equalTo, get } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import * as schema from "./classes";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// const firebaseConfig = {
// ...
// The value of `databaseURL` depends on the location of the database
// databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,

  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export function writeUserData(
  name: string,
  email: string,
  phone_number: string,
) {
  const db = getDatabase();
  const emailparts = email.split(".");
  const filteredemail = emailparts[0]+":"+emailparts[1];
  const postListRef = ref(db, "housemates/"+filteredemail);
  const user = new schema.Housemate(email, name, email, phone_number);
  set(postListRef, {
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    houses: user.house_ids,
  });
}

export function writeGroceryItem(name: string, quantity = 1, splits = []) {
  const db = getDatabase();
  const item = new schema.GroceryItem(name, quantity, splits);
  const postListRef = ref(db, "groceryitems/");
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: item.name,
    quantity: item.quantity,
    splits: item.splits,
  });
}

export function writeGroceryItemGrocerylist(grocerylist: string, name: string, quantity = 1, splits = []) {
  const db = getDatabase();
  const item = new schema.GroceryItem(name, quantity, splits);
  const postListRef = ref(db, "grocerylists/" +grocerylist+"/groceryitems");
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: item.name,
    quantity: item.quantity,
    splits: item.splits,
  });
}

export function updateGroceryItem(id, name: string, quantity = 1) {
  const db = getDatabase();
  update(ref(db, 'groceryitems/' + id), {
    name: name,
    quantity: quantity,

  });
}

export function updateGroceryItemGroceryList(grocerylist: string, id, name: string, quantity = 1) {
  const db = getDatabase();
  update(ref(db, "grocerylists/" +grocerylist+"/groceryitems/" + id), {
    name: name,
    quantity: quantity,

  });
}

export function readGroceryItems() {
  const db = getDatabase();
  const itemRef = ref(db, "groceryitems/");
  onValue(itemRef, (snapshot) => {
    const data = snapshot.val();
    return data;
  });
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
        // Check if the name matches and quantity matches one removed
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

export function removeGroceryItemGroceryList(grocerylist, name, quantity, splits=[]) {
  const db = getDatabase();
  const itemRef = ref(db, "grocerylists/" +grocerylist+"/groceryitems/"); 

  get(itemRef).then((snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.val() as Record<string, GroceryItem>; // Assert the type
      console.log('val: ', items);

      Object.entries(items).forEach(([key, item]) => {
        // Check if the name matches and quantity matches one removed
        if (item.name === name && item.quantity === quantity + 1) {
          const itemRef = ref(db, `grocerylists/${grocerylist}/groceryitems/${key}`);
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


export function writeHouseData(name, housecode, gl) {
  const db = getDatabase();
  const house = new schema.House(name);
  const postListRef = ref(db, 'houses/'+ housecode);
  set(postListRef, {
    name: house.name,
    members: house.members, 
    grocerylist: gl
  })
  return postListRef;
}

export function writeGroceryList(grocerylist, name) {
  const db = getDatabase();
  const postListRef = ref(db, 'grocerylists/'+ grocerylist);
  set(postListRef, {
    name: name,
    groceryitems: 1
  })
  return postListRef;
}

export async function createUser(
  name: string,
  phone_number: string,
  email: string,
  password: string,
) {
  console.log("Here1");
  return createUserWithEmailAndPassword(auth, email, password).then(() => {
    console.log("Here2");
    writeUserData(name, email, phone_number);
  });
}

export function userSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function userSignOut() {
  return signOut(auth);
}

export function getCurrentUser() {
  const user = auth.currentUser;
  return user;
}
