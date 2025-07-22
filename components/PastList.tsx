import React, { useState } from 'react';
import { Text, View, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router"; 

type PastListProps = {
  receiptId: string;
  date: string;
};

const PastList = ({ receiptId, date }: PastListProps) => {
  const formatDate = (dateString: string): string | null => {
    try {
      const parts = dateString.split('/');
      if (parts.length !== 3) return null;
  
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
  
      const date = new Date(year, month, day);
  
      if (isNaN(date.getTime())) return null;
  
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
  
      return date.toLocaleDateString('en-US', options);
    } catch {
      return null;
    }
  };

  return (
    <Link href={{
        pathname: '/bill/', 
        params: { receiptId: receiptId },
        }}
        className="flex items-center justify-center w-[85%] h-12 self-center px-4 border border-gray-300 bg-white rounded-lg">
        <View className="flex flex-row items-center justify-center w-full h-full">
            <Text className="text-1xl text-left w-full font-medium">{formatDate(date)}</Text>
        </View>
    </Link>
  )
}

export default PastList