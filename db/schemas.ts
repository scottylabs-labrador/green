import Realm, { ObjectSchema } from 'realm';

export class GroceryItem extends Realm.Object<GroceryItem> {
  _id!: number;
  name!: string;
  quantity!: number;
  housemates!: Realm.List<Housemate>;
  grocerylist!: Realm.List<GroceryList>;

  static schema: ObjectSchema = {
    name: 'GroceryItem',
    properties: {
      _id: 'int',
      name: 'string',
      quantity: 'int',
      housemates: 'Housemate[]',
      grocerylist: {
        type: 'linkingObjects',
        objectType: 'GroceryList',
        property: 'items',
      },
    },
  };
}

export class Housemate extends Realm.Object<Housemate> {
  _id!: number;
  name?: string;
  username!: string;
  password!: string;
  email?: string;
  grocerylist!: Realm.List<GroceryList>;
  itemlist!: Realm.List<GroceryItem>;

  static schema: ObjectSchema = {
    name: 'Housemate',
    properties: {
      _id: 'int',
      name: 'string',
      username: 'string',
      password: 'string',
      email: 'string',
      grocerylist: {
        type: 'linkingObjects',
        objectType: 'GroceryList',
        property: 'housemates',
      },
      itemlist: {
        type: 'linkingObjects',
        objectType: 'GroceryItem',
        property: 'housemates',
      },
    },
    primaryKey: '_id',
  };
}

export class GroceryList extends Realm.Object<GroceryList> {
  _id!: number;
  housemates!: Realm.List<Housemate>;
  items!: Realm.Object<GroceryItem>;

  static schema: ObjectSchema = {
    name: 'GroceryList',
    properties: {
      _id: 'int',
      housemates: 'Housemate[]',
      items: 'GroceryItem[]',
    },
    primaryKey: '_id',
  };
}
