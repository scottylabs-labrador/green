import React from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { updateGroceryItemGroceryList , removeGroceryItemGroceryList} from "../api/firebase";
import { updateGroceryItem, removeGroceryItem } from "../api/grocerylist";
import { Ionicons } from '@expo/vector-icons'
import SplitProfile from './SplitProfile';

type GroceryItemProps = {
  grocerylist: string | string[],
  id: string,
  name: string,
  quantity: number,
  splits: string[],
  member: string,
  colors: {}
};

const GroceryItem = ({grocerylist, id, name, quantity, splits, member, colors} : GroceryItemProps) => {
  const handleAddItem = (grocerylist, id, name, changeQuantity, member) => {
      updateGroceryItem(grocerylist, id, name, changeQuantity, member);
  }

  const handleSubItem = (grocerylist, id, name, changeQuantity, member) => {
    updateGroceryItem(grocerylist, id, name, changeQuantity, member);
    // if (quantity + changeQuantity > 0){
      //     updateGroceryItem(grocerylist, id, name, changeQuantity, member);
      //     //TODO: make setGroceryItem instead of writing so there's no 
      //     //time delay
      // }
      // removeGroceryItem(grocerylist, id);
  }

    // With old splits
    // const renderColor = ({ item }) => {
    //     try{
    //       return (
    //         // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
    //         <View className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ colors[splits[item]].color}}>
    //             <Text className="text-1xl self-center text-center text-white h-fit">{colors[splits[item]].name[0].toUpperCase()}</Text>
    //         </View>
    //       );
    //     }
    //     catch{
    //         return (
    //             // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
    //             <View className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#FFFFFF"}}>
    //                 <Text className="text-1xl self-center text-center text-white h-fit">U</Text>
    //             </View>
    //           );
    //     }
    //   }

      const renderColor = ({ item }) => {
        return <SplitProfile
          key={item}
          colors={colors}
          item={item}
          size={8}
          fontSize={"1xl"}
          quantity={splits[item]}
        />
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
 
  // return (
  //     <View className="flex-row items-stretch justify-center w-[85%] h-12 self-center px-2 border border-gray-300 rounded-lg">
  //         <Text className="flex-1 text-1xl text-left w-1/2 self-center">{name}</Text>
  //         {/* View fixed :)) */}
  //         <View className="flex-row self-center items-center w-fit gap-4">
  //           {splits ? <FlatList 
  //                 className="v-full"
  //                 data={Object.keys(splits)}
  //                 renderItem={renderColor}
  //                 keyExtractor={item => item}
  //                 horizontal={true}
  //                 contentContainerStyle={{ padding: 16 }} 
  //                 />
  //             : <View></View>}
  //         </View>
  //         <View className="flex-row self-center items-center w-fit gap-1">
  //             <Pressable className="center-right justify-center" onPress={() => handleSubItem(grocerylist, id, name, -1, member)}>
  //                 <Ionicons 
  //                     name="remove-circle" 
  //                     size={20} 
  //                     color="#164e2d"/>
  //             </Pressable>
  //             <Text className="text-1xl text-center w-fit justify-center">{quantity}</Text>
  //             <Pressable className="center-left justify-center margin-left-50" onPress={() => handleAddItem(grocerylist, id, name, 1, member)}>
  //                 <Ionicons 
  //                     name="add-circle" 
  //                     size={20} 
  //                     color="#164e2d"/>
  //             </Pressable>
  //         </View>
  //     </View>
  // )

  return (
    <View className="flex-row items-center justify-center w-[85%] h-12 self-center px-2 border border-gray-300 rounded-lg">
      <Text className="flex-1 text-left self-center">{name}</Text>

      <View className="flex-row items-center justify-end self-center space-x-2 max-w-[100px]">
        {splits ? (
          <FlatList
            data={Object.keys(splits)}
            renderItem={renderColor}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              justifyContent: 'flex-end', 
              flexGrow: 1, 
              alignItems: 'flex-end', 
              paddingHorizontal: 8, 
            }}
          />
        ) : (
          <View />
        )}
      </View>

      <View className="flex-row items-center self-center space-x-1 ml-4">
        <Pressable
          className="justify-center"
          onPress={() => handleSubItem(grocerylist, id, name, -1, member)}
        >
          <Ionicons name="remove-circle" size={20} color="#164e2d" />
        </Pressable>
        <Text className="text-center">{quantity}</Text>
        <Pressable
          className="justify-center"
          onPress={() => handleAddItem(grocerylist, id, name, 1, member)}
        >
          <Ionicons name="add-circle" size={20} color="#164e2d" />
        </Pressable>
      </View>
    </View>
  );
}

export default GroceryItem