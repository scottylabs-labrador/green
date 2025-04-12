import { getDatabase, ref, get, child } from "firebase/database";
import { getCurrentUser, } from "../api/firebase";

export const getGroceryListId = async () => {
  const db = getDatabase();
  let email = getCurrentUser().email;
  var emailParts = email.split(".");
  var filteredEmail = emailParts[0] + ":" + emailParts[1];
  const dbRef = ref(db);
  return get(child(dbRef, `housemates/${filteredEmail}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // console.log("data for house:" + data.houses[0].toString());
        let houses = data.houses[0].toString();
        const houseRef = child(dbRef, `houses/${houses}`);
        return get(houseRef);
      }
      else {
        console.log("failed to get houses");
        return Promise.reject("no house found");
      }
    })
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("data for grocery lists:" + data.grocerylist);
        let groceryList = data.grocerylist;
        return groceryList;
      }
      else {
        console.log("failed to get grocery list");
        return Promise.reject("no grocery list");
      }
    })
}