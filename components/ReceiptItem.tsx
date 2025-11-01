import React from 'react';

import type { Members, Splits } from '@db/types';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';

import SplitProfile from './SplitProfile';

type ReceiptItemProps = {
  id: string;
  name: string;
  price: number;
  splits?: Splits;
  colors?: Members;
  matched: boolean;
  receiptId: string;
};

const ReceiptItem = ({
  id,
  name,
  price,
  splits,
  colors = {},
  matched,
  receiptId,
}: ReceiptItemProps) => {
  const renderColor = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <SplitProfile
        key={item}
        colors={colors}
        housemateId={item}
        size={8}
        fontSize={'1xl'}
        quantity={splits ? splits[item] : 0}
      />
    );
  };

  return (
    <View
      className={`h-12 w-[85%] flex-row items-center justify-center self-center rounded-lg border border-gray-300 px-2 ${matched ? 'bg-white' : 'bg-peach'}`}
    >
      <Text className="flex-1 text-black">{name}</Text>

      <View className="max-w-[100px] flex-row items-center space-x-2 self-center">
        {splits ? (
          <FlatList
            data={Object.keys(splits || {})}
            renderItem={renderColor}
            keyExtractor={item => item}
            horizontal
            contentContainerStyle={{
              justifyContent: 'flex-end',
              flexGrow: 1,
              alignItems: 'flex-end',
              paddingHorizontal: 8,
            }}
          />
        ) : null}
      </View>
      <Text className="mx-2 w-12 text-right">${price.toFixed(2)}</Text>
      <Link
        href={{
          pathname: '/unmatched/',
          params: { itemId: id, receiptId },
        }}
        asChild
      >
        <Ionicons name="pencil" size={16} color="black" />
      </Link>
    </View>
  );
};

export default ReceiptItem;
