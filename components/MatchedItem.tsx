import React from 'react';

import { Text, View } from 'react-native';

type ReceiptItemProps = {
  id: string;
  name: string;
  price: number;
  receiptId: string;
};

const MatchedItem = ({ id, name, price, receiptId }: ReceiptItemProps) => {
  return (
    <View
      className={`my-2 h-12 w-[90%] flex-row items-center justify-center gap-3 self-center rounded-lg border border-gray-300 bg-white px-2`}
    >
      <Text className="text-1xl w-1/2 grow self-center text-left">{name}</Text>
      <Text className="text-1xl w-1/8 self-center">{price}</Text>
    </View>
  );
};

export default MatchedItem;
