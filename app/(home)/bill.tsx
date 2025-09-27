import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { getCurrentUser } from '../../api/firebase';
import ReceiptItem from '../../components/ReceiptItem';
import type { ReceiptItems } from '../../db/types';

export default function Bill() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();

  const [matchedItems, setMatchedItems] = useState<ReceiptItems>({});
  const [unmatchedItems, setUnmatchedItems] = useState<ReceiptItems>({});
  const [createDate, setCreateDate] = useState('');
  const [colors, setColors] = useState({});
  const db = getDatabase();

  useEffect(() => {
    const fetchData = () => {
      const receiptRef = ref(db, 'receipts/' + receiptId);
      get(receiptRef).then(snapshot => {
        const data = snapshot.val();
        let unmatched: ReceiptItems = {};
        let matched: ReceiptItems = {};
        if (data && data.receiptitems) {
          if (data.receiptitems) {
            const receiptItems = data.receiptitems;
            for (const key of Object.keys(receiptItems)) {
              if (receiptItems[key].groceryItem.length == 0) {
                unmatched[key] = receiptItems[key];
              } else {
                matched[key] = receiptItems[key];
              }
            }
            setUnmatchedItems(unmatched);
            setMatchedItems(matched);
          }
          if (data.date) {
            let date = data.date;
            let parts = date.split('/');
            let year = parts[2].slice(-2);
            date = `${parts[0]}.${parts[1]}.${year}`;
            setCreateDate(date);
          } else {
            const currentDate = new Date();
            let date = currentDate.toLocaleDateString();
            let parts = date.split('/');
            let year = parts[2].slice(-2);
            date = `${parts[0]}.${parts[1]}.${year}`;
            setCreateDate(date);
          }
        }
      });

      const email = getCurrentUser()?.email || '';
      const filteredEmail = email.split('.').join(':');
      try {
        const itemRef = ref(db, 'housemates/' + filteredEmail);
        var houses;
        onValue(itemRef, snapshot => {
          try {
            const data = snapshot.val();
            houses = data.houses[0].toString();
          } catch {
            console.error('failed to get houses');
          }
        });
        const houseRef = ref(db, 'houses/' + houses);
        onValue(houseRef, snapshot => {
          try {
            const data = snapshot.val();
            var members = data.members;
            setColors(members);
          } catch {
            console.error('failed to get members from house');
          }
        });
      } catch {
        console.error('failed to get user');
      }
    };
    fetchData();
  }, [db]);

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
        // quantity={matchedItems[item].quantity}
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
