import * as crypto from 'crypto';
import * as functions from 'firebase-functions';

import { exists, get, remove, setTyped, updateTyped } from '../db/db';
import type { GroceryItem, GroceryList, Splits } from '../db/types';
import { houseExists, userInHouse } from '../validation/verify';

export const writeGroceryList = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string , name: string, houseId: string }>) => {
    const { grocerylist, name, houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }
    if (!grocerylist || !name || !houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist, name, and houseId are required');
    }
    if (!(await houseExists(houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId does not exist');
    }

    const houseName = await get(`houses/${houseId}/name`);
    if (houseName !== name) {
      throw new functions.https.HttpsError('invalid-argument', 'name must match with house name');
    }

    const newGroceryList : GroceryList = {
        name: name,
        groceryitems: {}, 
        houseId: houseId
    };
    await setTyped<GroceryList>(`grocerylists/${grocerylist}`, newGroceryList)
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

    const houseId = await get(`grocerylists/${grocerylist}/houseId`);
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a part of the house');
    }

    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }
    if (name.length == 0 || name.length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name length must be between 1 and 30');
    }

    if (!member || !(await userInHouse(member, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'member is required');
    }

    if (!quantity || quantity <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'quantity is required and must be greater than 0');
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

    await setTyped<GroceryItem>(`grocerylists/${grocerylist}/groceryitems/${token}`, newgroceryitem);
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

    const houseId = await get(`grocerylists/${grocerylist}/houseId`);
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a part of the house')
    }

    if (!id) {
      throw new functions.https.HttpsError('invalid-argument', 'id is required');
    }

    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }
    if (name.length == 0 || name.length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name length must be between 1 and 30');
    }

    if (!changeQuantity) {
      throw new functions.https.HttpsError('invalid-argument', 'quantity is required');
    }

    if (!member || !(await userInHouse(member, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'member is required and must be a part of the house');
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
      await updateTyped<GroceryItem>(`grocerylists/${grocerylist}/groceryitems/${id}`, groceryitem);
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
            await remove(`grocerylists/${grocerylist}/groceryitems/${id}`)
          }
          else if(currmemberquantity + changeQuantity <= 0) {
            await remove(`grocerylists/${grocerylist}/groceryitems/${id}/splits/${member}`)
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
  async (request: functions.https.CallableRequest<{ grocerylist: string, id: string }>) => {
    const { grocerylist, id } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist is required');
    }

    const houseId = await get(`grocerylists/${grocerylist}/houseId`);
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a part of the house');
    }

    if (!id) {
      throw new functions.https.HttpsError('invalid-argument', 'id is required');
    }

    await remove(`grocerylists/${grocerylist}/groceryitems/${id}`);
  },
);

export const clearGroceryItems = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ grocerylist: string }>) => {
    const { grocerylist } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!grocerylist) {
      throw new functions.https.HttpsError('invalid-argument', 'grocerylist is required');
    }

    const houseId = await get(`grocerylists/${grocerylist}/houseId`);
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a part of the house');
    }

    await remove(`grocerylists/${grocerylist}/groceryitems`);
  },
)



