import React, { useState } from 'react';

import type { Members, Splits } from '@db/types';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { updateGroceryItem } from '../api/grocerylist';

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
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSubtract, setLoadingSubtract] = useState(false);

  const updateItem = async (quantity: number) => {
    if (quantity === 0) return;
    
    let timer = setTimeout(() => {
      if (quantity > 0) setLoadingAdd(true);
      else setLoadingSubtract(true);
    }, 1000);

    try {
      await updateGroceryItem(groceryListId, id, name, quantity, member);
    } catch (err) {
      console.error("Error updating grocery item:", err);
    }

    setLoadingAdd(false);
    setLoadingSubtract(false);

    clearTimeout(timer);
  }

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
    <View className={`h-12 w-[85%] flex-row items-center justify-center self-center rounded-lg border border-gray-300 px-2` + (loadingSubtract ? ' bg-red-50' : '') + (loadingAdd ? ' bg-green-50' : '')}>
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

      <View className="ml-3 w-16">
        {!loadingAdd && !loadingSubtract && (
          <View className=" flex-row items-center justify-center space-x-1 self-center">
            <Pressable
              className="justify-center"
              onPress={() => updateItem(-1)}
            >
              <Ionicons name="remove-circle" size={20} color="#164e2d" />
            </Pressable>
            <Text className="text-center">{quantity}</Text>
            <Pressable
              className="justify-center"
              onPress={() => updateItem(1)}
            >
              <Ionicons name="add-circle" size={20} color="#164e2d" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default GroceryItem;
