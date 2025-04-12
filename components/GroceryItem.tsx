import React from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { removeGroceryItem, writeGroceryItem, updateGroceryItem, updateGroceryItemGroceryList , removeGroceryItemGroceryList} from "../api/firebase";
import { Ionicons } from '@expo/vector-icons'

type GroceryItemProps = {
  grocerylist: string,
  id: string,
  name: string,
  quantity: number,
  splits: string[],
  member: string,
  colors: {}
};

const GroceryItem = ({grocerylist, id, name, quantity, splits, member, colors} : GroceryItemProps) => {

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

    const renderColor = ({ item }) => {
        try{
          return (
            // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
            <div className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ colors[splits[item]].color}}>
                <Text className="flex-1 text-1xl text-left w-1/2 self-center text-center text-white">{colors[splits[item]].name[0].toUpperCase()}</Text>
            </div>
          );
        }
        catch{
            return (
                // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
                <div className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#FFFFFF"}}>
                    <Text className="flex-1 text-1xl text-left w-1/2 self-center text-center text-white">U</Text>
                </div>
              );
        }
      }

    // const renderItem = ({ item }) => {
    //     return (
    //         // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{Object.values(colors)}</Text>
    //         <FlatList 
    //         className="v-full"
    //         data={item}
    //         renderItem={renderColor}
    //         keyExtractor={item => item}
    //         />
    //     );
    // }
 
  return (
      <View className="flex-row items-stretch justify-center w-[85%] h-12 self-center my-2 px-2 border border-gray-300 rounded-lg">
          <Text className="flex-1 text-1xl text-left w-1/2 self-center">{name}</Text>
          {/* View fixed :)) */}
          <View className="flex-row self-center items-center w-fit gap-4">
          {splits ? <FlatList 
                className="v-full"
                data={Object.keys(splits)}
                renderItem={renderColor}
                keyExtractor={item => item}
                horizontal={true}
                contentContainerStyle={{ padding: 16 }} 
                />
            : <View></View>}
          </View>
          <View className="flex-row self-center items-center w-fit gap-1">
              <Pressable className="center-right justify-center" onPress={() => handleSubItem(grocerylist, id, name, quantity, splits)}>
                  <Ionicons 
                      name="remove-circle" 
                      size={20} 
                      color="#164e2d"/>
              </Pressable>
              <Text className="text-1xl text-center w-fit justify-center">{quantity}</Text>
              <Pressable className="center-left justify-center margin-left-50" onPress={() => handleAddItem(grocerylist, id, name, quantity, splits)}>
                  <Ionicons 
                      name="add-circle" 
                      size={20} 
                      color="#164e2d"/>
              </Pressable>
          </View>
      </View>
  )
}

export default GroceryItem