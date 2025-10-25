import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { getCurrentUser } from '../../api/auth';
import { db } from '../../api/firebase';
import ReceiptItem from '../../components/ReceiptItem';
import type { ReceiptItems } from '../../db/types';

export default function Bill() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();

  const [matchedItems, setMatchedItems] = useState<ReceiptItems>({});
  const [unmatchedItems, setUnmatchedItems] = useState<ReceiptItems>({});
  const [createDate, setCreateDate] = useState('');
  const [colors, setColors] = useState({});

  useEffect(() => {
    if (!receiptId) return;
    
    // Listen for receipt + receiptitems updates
    const receiptRef = ref(db, `receipts/${receiptId}`);
    const unsubscribeReceipt = onValue(receiptRef, snapshot => {
      const data = snapshot.val();
      if (!data) return;

      // Separate matched vs unmatched items
      const matched: ReceiptItems = {};
      const unmatched: ReceiptItems = {};

      if (data.receiptitems) {
        for (const key of Object.keys(data.receiptitems)) {
          const item = data.receiptitems[key];
          if (item.groceryItem?.length === 0) unmatched[key] = item;
          else matched[key] = item;
        }
      }

      setMatchedItems(matched);
      setUnmatchedItems(unmatched);

      // Date formatting
      const date =
        data.date ??
        new Date().toLocaleDateString(undefined, {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit',
        });

      const [month, day, year] = date.split(/[./-]/);
      setCreateDate(`${month}.${day}.${year}`);
    });

    // Get housemates' colors
    const email = getCurrentUser()?.email || '';
    if (!email) return;

    const filteredEmail = email.split('.').join(':');
    const userRef = ref(db, `housemates/${filteredEmail}`);

    let unsubscribeColors: (() => void) | undefined;

    const unsubscribeUser = onValue(userRef, snapshot => {
      const userData = snapshot.val();
      if (!userData?.houses?.length) return;

      const houseId = userData.houses[0];
      const houseRef = ref(db, `houses/${houseId}`);

      // Remove old listener if we switch houses
      if (unsubscribeColors) unsubscribeColors();

      unsubscribeColors = onValue(houseRef, houseSnap => {
        const houseData = houseSnap.val();
        if (houseData?.members) {
          setColors(houseData.members);
        }
      });
    });

    // Cleanup all listeners when unmounting
    return () => {
      unsubscribeReceipt();
      unsubscribeUser();
      if (unsubscribeColors) unsubscribeColors();
    };
  }, [db, receiptId]);

  const renderMatchedItem = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <ReceiptItem
        key={item}
        id={item}
        name={matchedItems[item].groceryItem}
        // quantity={matchedItems[item].quantity}
        price={matchedItems[item].price}
        splits={matchedItems[item].splits}
        colors={colors}
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
            <Text className="text-1xl text-right font-light text-white">Change</Text>
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
