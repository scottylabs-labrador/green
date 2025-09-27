import React from 'react';

import { Link } from 'expo-router';
import { Text, View } from 'react-native';

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
    <Link
      href={{
        pathname: '/bill/',
        params: { receiptId: receiptId },
      }}
      className="flex h-12 w-[85%] items-center justify-center self-center rounded-lg border border-gray-300 bg-white px-4"
    >
      <View className="flex h-full w-full flex-row items-center justify-center">
        <Text className="text-1xl w-full text-left font-medium">{formatDate(date)}</Text>
      </View>
    </Link>
  );
};

export default PastList;
