import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { updateGroceryItem } from '../api/grocerylist';
import type { Members, Splits } from '../db/types';

import SplitProfile from './SplitProfile';

type GroceryItemProps = {
  groceryListId: string
  id: string;
  name: string;
  quantity: number;
  splits: Splits;
  member: string;
  colors: Members;
};

const GroceryItem = ({
  groceryListId,
  id,
  name,
  quantity,
  splits,
  member,
  colors,
}: GroceryItemProps) => {
  const renderColor = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <SplitProfile
        key={item}
        colors={colors}
        housemateId={item}
        size={8}
        fontSize={'1xl'}
        quantity={splits[item]}
      />
    );
  };

  return (
    <View className="h-12 w-[85%] flex-row items-center justify-center self-center rounded-lg border border-gray-300 px-2">
      <Text className="flex-1 self-center text-left">{name}</Text>

      <View className="max-w-[100px] flex-row items-center justify-end space-x-2 self-center">
        {splits ? (
          <FlatList
            data={Object.keys(splits)}
            renderItem={renderColor}
            keyExtractor={item => item}
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

      <View className="ml-4 flex-row items-center space-x-1 self-center">
        <Pressable
          className="justify-center"
          onPress={() => updateGroceryItem(groceryListId, id, name, -1, member)}
        >
          <Ionicons name="remove-circle" size={20} color="#164e2d" />
        </Pressable>
        <Text className="text-center">{quantity}</Text>
        <Pressable
          className="justify-center"
          onPress={() => updateGroceryItem(groceryListId, id, name, 1, member)}
        >
          <Ionicons name="add-circle" size={20} color="#164e2d" />
        </Pressable>
      </View>
    </View>
  );
};

export default GroceryItem;
