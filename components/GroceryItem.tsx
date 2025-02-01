import React from "react";
import { Text, View, Pressable } from "react-native";
import { removeGroceryItem, writeGroceryItem, updateGroceryItem, updateGroceryItemGroceryList , removeGroceryItemGroceryList} from "../api/firebase";
import { Ionicons } from '@expo/vector-icons'

type GroceryItemProps = {
  grocerylist: string,
  id: string,
  name: string,
  quantity: number,
  splits: string[],
  member: string
};

const GroceryItem = ({grocerylist, id, name, quantity, splits, member} : GroceryItemProps) => {

  const handleAddItem = (grocerylist, id, name, quantity, splits) => {
      console.log("handleadditem");
      updateGroceryItemGroceryList(grocerylist, id, name, quantity + 1, splits, member);
  }

  const handleSubItem = (grocerylist, id, name, quantity, splits) => {
      if (quantity != 1){
          updateGroceryItemGroceryList(grocerylist, id, name, quantity - 1, splits, member)
          //TODO: make setGroceryItem instead of writing so there's no 
          //time delay
      }
      removeGroceryItemGroceryList(grocerylist, name, quantity - 1)
  }
 
  return (
      <View className="flex-row items-stretch justify-center w-[85%] h-12 self-center my-2 px-2 border border-gray-300 rounded-lg">
          <Text className="flex-1 text-1xl text-left w-1/2 self-center">{name}</Text>
          <View className="flex-row self-center items-center w-fit gap-1">
              <Pressable className="center-right justify-center" onPress={() => handleSubItem(grocerylist, id, name, quantity, splits)}>
                  <Ionicons 
                      name="remove-circle" 
                      size={20} 
                      color="#3e5636"/>
              </Pressable>
              <Text className="text-1xl text-center w-fit justify-center">{quantity}</Text>
              <Pressable className="center-left justify-center margin-left-50" onPress={() => handleAddItem(grocerylist, id, name, quantity, splits)}>
                  <Ionicons 
                      name="add-circle" 
                      size={20} 
                      color="#3e5636"/>
              </Pressable>
          </View>
      </View>
  )
}

export default GroceryItem