import React, { useEffect, useState } from 'react';

import type { ReceiptItems } from '@db/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { listenForReceipt } from '@/api/receipt';

import { useHouseInfo } from '@/context/HouseContext';
import ReceiptItem from '../../components/ReceiptItem';

export default function Bill() {
  const { houseId, members } = useHouseInfo();

  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();

  const [matchedItems, setMatchedItems] = useState<ReceiptItems>({});
  const [unmatchedItems, setUnmatchedItems] = useState<ReceiptItems>({});
  const [createDate, setCreateDate] = useState('');

  useEffect(() => {
    if (!receiptId) return;

    try {
      const unsubscribeReceipt = listenForReceipt(receiptId, (receipt) => {
        const receiptItems = receipt.receiptitems || {};
        const date = receipt.date || new Date().toLocaleDateString();

        const matched: ReceiptItems = {};
        const unmatched: ReceiptItems = {};

        for (const key of Object.keys(receiptItems)) {
          const item = receiptItems[key];
          if (item.receiptItem.length === 0) continue;
          if (item.groceryItem.length === 0) unmatched[key] = item;
          else matched[key] = item;
        }

        setMatchedItems(matched);
        setUnmatchedItems(unmatched);

        const [month, day, year] = date.split(/[./-]/);
        setCreateDate(`${month}.${day}.${year}`);
      });

      return () => unsubscribeReceipt();
    } catch (err) {
      console.error("Error listening for receipt:", err);
    }
  }, [receiptId]);

  const renderMatchedItem = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <ReceiptItem
        key={item}
        id={item}
        name={matchedItems[item].groceryItem}
        price={matchedItems[item].price}
        splits={matchedItems[item].splits}
        colors={members}
        matched={true}
        receiptId={receiptId}
      />
    );
  };
  const renderUnmatchedItem = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <ReceiptItem
        key={item}
        id={item}
        name={unmatchedItems[item].receiptItem}
        price={unmatchedItems[item].price}
        matched={false}
        receiptId={receiptId}
      />
    );
  };

  const AddItem = () => {
    return (
      <Link
        href={{
          pathname: '/unmatched/',
          params: { itemId: null, receiptId: receiptId },
        }}
        className="flex h-12 w-[85%] items-center justify-center self-center rounded-lg border border-gray-300"
      >
        <View className="w-full flex-row items-center justify-center gap-3 px-2">
          <Text className="text-1xl grow text-left text-gray-500">Add Item</Text>
          <Ionicons name="add" size={24} color="lightgray" />
        </View>
      </Link>
    );
  };

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1">
        <View className="mb-8 mt-16 flex h-16 flex-col items-center justify-center">
          <Text className="text-1xl text-center font-medium text-white">Scanned Receipt</Text>
          <Text className="text-center text-4xl font-medium text-white">Here's what we got.</Text>
          <View className="mt-1 w-[85%] flex-row self-center">
            <Text className="text-1xl grow text-left font-light text-white">
              Cross-referenced with list {createDate}
            </Text>
            <Link href={{ pathname: '/pastlists', params: { houseId: houseId } }} asChild>
              <Text className="text-1xl text-right font-light text-white underline">Change</Text>
            </Link>
          </View>
        </View>
        <View className="h-[200px] w-full flex-grow self-end overflow-hidden rounded-t-[40px] bg-white pt-6">
          {Object.keys(unmatchedItems).length > 0 ? (
            <View className="mb-4 max-h-[50%]">
              <Text className="text-1xl mb-4 px-6 text-left font-medium text-black">
                Unmatched Items:
              </Text>
              <FlatList
                data={Object.keys(unmatchedItems)}
                renderItem={renderUnmatchedItem}
                keyExtractor={item => item}
                contentContainerStyle={{ gap: 8 }}
                style={{ flexGrow: 0 }}
              />
            </View>
          ) : (
            <View></View>
          )}
          <View className="flex-1">
            <Text className="text-1xl mb-4 px-6 text-left font-medium text-black">
              Matched Items:
            </Text>
            <FlatList
              className="h-full"
              data={Object.keys(matchedItems)}
              renderItem={renderMatchedItem}
              keyExtractor={item => item}
              ListFooterComponent={<AddItem />}
              contentContainerStyle={{ gap: 8 }}
            />
          </View>
          {Object.keys(unmatchedItems).length == 0 ? (
            <View className="bg-white">
              <Pressable className="self-center rounded-lg bg-magenta px-6 py-3 hover:bg-dark-magenta">
                <Link
                  href={{ pathname: '/message', params: { receiptId: receiptId } }}
                  className="flex items-center justify-center"
                >
                  <Text className="text-sm font-semibold text-white">Generate Totals</Text>
                </Link>
              </Pressable>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      </View>
    </View>
  );
}
