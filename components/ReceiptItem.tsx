import React, { useState } from 'react';
import { Text, View } from "react-native";
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
  return (
    <View className={
      `flex-row items-center justify-center w-[90%] h-12 self-center my-2 px-2 gap-3 border border-gray-300 rounded-lg +
      ${matched ? 'bg-white' : 'bg-[#e9b79f]'}`
      }>
        <Text className="text-1xl grow text-left w-1/2 self-center">{name}</Text>
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