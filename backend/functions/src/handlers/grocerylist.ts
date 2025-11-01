import * as functions from 'firebase-functions';
import * as crypto from 'crypto';

import type { GroceryList, Splits, GroceryItem } from '..//db/types';
import { setTyped, updateTyped, exists, get, deleteData } from '../db/db';

export const writeGroceryList = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string , name: string}>) => {
    const { grocerylist, name } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist || !name) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist and name are required');
    }

    const newgrocerylist : GroceryList = {
        name: name,
        groceryitems: {}
    };
    await setTyped<GroceryList>(`grocerylists/${grocerylist}`, newgrocerylist)
  },
);

export const writeGroceryItem = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string, name: string, member: string, quantity: number}>) => {
    const { grocerylist, name, member, quantity } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist is required');
    }

    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }

    if (!member) {
      throw new functions.https.HttpsError('invalid-argument', 'member is required');
    }

    if (!quantity) {
      throw new functions.https.HttpsError('invalid-argument', 'quantity is required');
    }

    let splits: Splits =  {};
    splits[member] = quantity;

    const newgroceryitem : GroceryItem = {
        name: name,
        quantity: quantity,
        splits: splits
    }

    const randomBytes = crypto.randomBytes(16);
    const token = Array.from(randomBytes)
      .map(b => b.toString(36).padStart(2, '0'))
      .join('');

    await setTyped<GroceryItem>(`grocerylists/${grocerylist}/groceryitems/${token}`, newgroceryitem)
  },
);


export const updateGroceryItem = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string, id: string, name: string, changeQuantity: number, member: string}>) => {
    const { grocerylist, id, name, changeQuantity, member} = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist is required');
    }

    if (!id) {
      throw new functions.https.HttpsError('invalid-argument', 'id is required');
    }

    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }

    if (!changeQuantity) {
      throw new functions.https.HttpsError('invalid-argument', 'quantity is required');
    }

    if (!member) {
      throw new functions.https.HttpsError('invalid-argument', 'member is required');
    }

    const itemexists = await exists(`grocerylists/${grocerylist}/groceryitems/${id}`);
    if (!itemexists && changeQuantity > 0){
      const groceryitem : GroceryItem = {
        name: name,
        quantity: changeQuantity,
        splits: {
          [member]: changeQuantity
        }
      }
      await updateTyped<GroceryItem>(`grocerylists/${grocerylist}/groceryitems/${id}`, groceryitem)
    }
    
    if (itemexists){
      const isRemoveItem = changeQuantity < 0;
      const userInSplits = await exists(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`);

      const currquantity = await get(`grocerylists/${grocerylist}/groceryitems/${id}/quantity`);

      if (userInSplits){
        const currmemberquantity = await get(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`);
        if (!isRemoveItem){
          await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/quantity`, currquantity + changeQuantity)
          await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`, currmemberquantity + changeQuantity)
        }
        else{
          if (currquantity + changeQuantity <= 0){
            await deleteData(`grocerylists/${grocerylist}/groceryitems/${id}`)
          }
          else if(currmemberquantity + changeQuantity <= 0) {
            await deleteData(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`)
            await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/quantity`, currquantity + changeQuantity)
          }
          else{
            await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/quantity`, currquantity + changeQuantity)
            await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`, currmemberquantity + changeQuantity)
          }
        }
      }
      else{
        if (!isRemoveItem){
          await setTyped<Number>(`grocerylists/${grocerylist}/groceryitems/${id}/quantity`, currquantity + changeQuantity)
          const currsplits = await get(`grocerylists/${grocerylist}/groceryitems/${id}/splits`);
          const newsplits : Splits = {
            ...currsplits,
            [member]: changeQuantity
          }
          await setTyped<Splits>(`grocerylists/${grocerylist}/groceryitems/${id}/splits`, newsplits);
        }

      }
      return await get(`grocerylists/${grocerylist}/groceryitems`);
    }
  },
);

export const removeGroceryItem = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string, id: string}>) => {
    const { grocerylist, id } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist is required');
    }

    if (!id) {
      throw new functions.https.HttpsError('invalid-argument', 'id is required');
    }

    const itemexists = await exists(`grocerylists/${grocerylist}/groceryitems/${id}`);
    if (itemexists){
      await deleteData(`grocerylists/${grocerylist}/groceryitems/${id}`);
    }
  },
);



