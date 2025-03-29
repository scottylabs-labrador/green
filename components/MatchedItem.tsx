import React, { useState } from 'react';
import { Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router"; 

type ReceiptItemProps = {
  id: string;
  name: string;
  price: number;
  receiptId: string;
};

const MatchedItem = ({ id, name, price, receiptId }: ReceiptItemProps) => {
  return (
    <View className={
      `flex-row items-center justify-center w-[90%] h-12 self-center my-2 px-2 gap-3 border border-gray-300 rounded-lg bg-white`
      }>
        <Text className="text-1xl grow text-left w-1/2 self-center">{name}</Text>
        <Text className="text-1xl w-1/8 self-center">{price}</Text>
    </View>
  )
}

export default MatchedItem