import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  runTransaction,
  set
} from 'firebase/database';
import { getCurrentUser } from '../api/firebase';
import * as schema from './classes';

export const getGroceryListId = async () => {
  const db = getDatabase();
  let email = getCurrentUser().email;
  var emailParts = email.split('.');
  var filteredEmail = emailParts[0] + ':' + emailParts[1];
  const dbRef = ref(db);
  return get(child(dbRef, `housemates/${filteredEmail}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let houses = data.houses[0].toString();
        const houseRef = child(dbRef, `houses/${houses}`);
        return get(houseRef);
      } else {
        console.error('failed to get houses');
        return Promise.reject('no house found');
      }
    })
    .then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let groceryList = data.grocerylist;
        return groceryList;
      } else {
        console.error('failed to get grocery list');
        return Promise.reject('no grocery list');
      }
    });
};

interface GroceryItem {
  name: string;
  quantity: number;
  splits: Record<string, number>;
}

export function getGroceryListIdFromHouse(houseId: string) {
  const db = getDatabase();
  const dbRef = ref(db);
  return get(child(dbRef, "houses/" + houseId + "/grocerylist")).then((snapshot) => {
    if (snapshot.exists()) {
      const groceryListId = snapshot.val();
      return groceryListId;
    } else {
      console.error('failed to get grocery list id from house id');
      return Promise.reject('no grocery list');
    }
  })
}

export function writeGroceryItem(
  grocerylist: string | string[],
  name: string,
  member: string,
  quantity = 1,
) {
  const db = getDatabase();
  const postListRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems');
  let splits = {};
  splits[member] = quantity;
  const item = new schema.GroceryItem(name, quantity, []);
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: item.name,
    quantity: item.quantity,
    splits: splits,
  });
}

// export function updateGroceryItemGroceryList(grocerylist: string, id, name: string, totalQuantity = 1, userQuantity = 1, splits = {}, member: string) {
//   const db = getDatabase();
//   if (userQuantity <= 0) {
//     delete splits[member];
//   }
//   else if (!(member in splits)){
//     splits[member] = userQuantity;
//   }
//   update(ref(db, "grocerylists/" +grocerylist+"/groceryitems/" + id), {
//     name: name,
//     quantity: totalQuantity,
//     splits: splits
//   });
// }

export function updateGroceryItem(
  grocerylist: string,
  id: string,
  name: string,
  changeQuantity = 1,
  member: string,
) {
  const db = getDatabase();
  const itemRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems/');

  runTransaction(itemRef, currentData => {
    if (currentData == null) {
      return {
        [id]: {
          name: name,
          quantity: changeQuantity,
          splits: {
            [member]: changeQuantity,
          },
        },
      };
    }

    if (currentData[id] == null && changeQuantity > 0) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: changeQuantity,
          splits: {
            [member]: changeQuantity,
          },
        },
      };
    }

    const isRemoveItem = changeQuantity < 0;
    const userInSplits = currentData[id].splits?.[member];

    if (userInSplits && !isRemoveItem) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: currentData[id].quantity + changeQuantity,
          splits: {
            ...currentData[id].splits,
            [member]: currentData[id].splits?.[member] + changeQuantity,
          },
        },
      };
    } else if (userInSplits && isRemoveItem) {
      if (currentData[id].quantity + changeQuantity <= 0) {
        delete currentData[id];
        return currentData;
      } else if (currentData[id].splits?.[member] + changeQuantity <= 0) {
        let splits = { ...currentData[id].splits };
        delete splits[member];
        return {
          ...currentData,
          [id]: {
            name: name,
            quantity: currentData[id].quantity + changeQuantity,
            splits: splits,
          },
        };
      } else {
        return {
          ...currentData,
          [id]: {
            name: name,
            quantity: currentData[id].quantity + changeQuantity,
            splits: {
              ...currentData[id].splits,
              [member]: currentData[id].splits?.[member] + changeQuantity,
            },
          },
        };
      }
    } else if (!userInSplits && !isRemoveItem) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: currentData[id].quantity + changeQuantity,
          splits: {
            ...currentData[id].splits,
            [member]: changeQuantity,
          },
        },
      };
    }

    return currentData;
  });
}

export function removeGroceryItem(grocerylist: string, id: string) {
  const db = getDatabase();
  const itemRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems/');

  get(itemRef).then(snapshot => {
    if (snapshot.exists()) {
      const items = snapshot.val();

      Object.keys(items).forEach(itemId => {
        // Check if the name matches and quantity matches one removed
        if (itemId == id) {
          const itemRef = ref(db, `grocerylists/${grocerylist}/groceryitems/${id}`);
          remove(itemRef) // Remove the item
            .catch(error => console.error('Error removing item:', error));
        }
      });
    } else {
      console.error('No matching items found');
    }
  });
}
