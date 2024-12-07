import React from "react";
import { Text, View, Pressable } from "react-native";
import { removeGroceryItem, writeGroceryItem, updateGroceryItem } from "../api/firebase";
import { Ionicons } from '@expo/vector-icons'

type GroceryItemProps = {
  id: string,
  name: string;
  quantity: number;
};

const GroceryItem = ({id, name, quantity} : GroceryItemProps) => {

  const handleAddItem = (id, name, quantity) => {
      console.log("handleadditem");
      updateGroceryItem(id, name, quantity + 1);
  }

  const handleSubItem = (id, name, quantity) => {
      if (quantity != 1){
          updateGroceryItem(id, name, quantity - 1)
          //TODO: make setGroceryItem instead of writing so there's no 
          //time delay
      }
      removeGroceryItem(name, quantity - 1)
  }
 
  return (
      <View className="flex-row items-stretch justify-center w-[85%] h-12 self-center my-2 px-2 border border-gray-300 rounded-lg">
          <Text className="flex-1 text-1xl text-left w-1/2 self-center">{name}</Text>
          <View className="flex-row self-center items-center w-fit gap-1">
              <Pressable className="center-right justify-center" onPress={() => handleSubItem(id, name, quantity)}>
                  <Ionicons 
                      name="remove-circle" 
                      size={20} 
                      color="#3e5636"/>
              </Pressable>
              <Text className="text-1xl text-center w-fit justify-center">{quantity}</Text>
              <Pressable className="center-left justify-center margin-left-50" onPress={() => handleAddItem(id, name, quantity)}>
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