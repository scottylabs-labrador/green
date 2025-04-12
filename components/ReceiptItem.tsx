import React, { useState } from 'react';
import { Text, View, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router"; 

type ReceiptItemProps = {
  id: string;
  name: string;
  price: number;
  matched: boolean;
  receiptId: string;
};

const ReceiptItem = ({ id, name, price, matched, receiptId }: ReceiptItemProps) => {
  let splits = [];
  let colors = {};
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
  
  return (
    <View className={
      `flex-row items-center justify-center w-[90%] h-12 self-center my-2 px-2 gap-3 border border-gray-300 rounded-lg +
      ${matched ? 'bg-white' : 'bg-[#e9b79f]'}`
      }>
        <Text className="text-1xl grow text-left w-1/2 self-center">{name}</Text>
        {splits ? <FlatList 
                    className="v-full"
                    data={Object.keys(splits)}
                    renderItem={renderColor}
                    keyExtractor={item => item}
                    horizontal={true}
                    contentContainerStyle={{ padding: 16 }} 
                    />
                : <View></View>}
        <Text className="text-1xl w-1/8 self-center">${price.toFixed(2)}</Text>
        <Link href={{
          pathname: '/unmatched/', 
          params: { itemId: id, receiptId: receiptId },
          }}>
          <Ionicons
            name="pencil" 
            size={16} 
            color="black"
            className="w-1/8 p-2"/>
        </Link>
    </View>
  )
}

export default ReceiptItem