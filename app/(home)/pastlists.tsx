import React, { useEffect, useState } from 'react';

import { ReceiptRecordsInHouse } from '@db/types';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, Image, ListRenderItemInfo, Text, View } from 'react-native';

import { listenForHouseInfo } from '@/api/house';

import emptyList from '../../assets/empty-list.png';
import PastList from '../../components/PastList';

export default function PastLists() {
  const { houseId } = useLocalSearchParams<{ houseId: string }>();

  const [pastLists, setPastLists] = useState<ReceiptRecordsInHouse>({});
  const [houseName, setHouseName] = useState("");

  useEffect(() => {
    if (!houseId) return;
    
    try {
      const unsubscribe = listenForHouseInfo(houseId, (house) => {
        setPastLists(house.receipts || {});
        setHouseName(house.name || "");
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening for house info:", err);
    }
  }, [houseId]);

  const renderItem = ({ item }: ListRenderItemInfo<string>) => {
    return <PastList key={item} receiptId={item} date={pastLists[item].date} />;
  };

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1">
        <View className="mb-8 mt-16 flex h-16 flex-col items-center justify-center">
          <Text className="text-center text-4xl font-medium text-white">List History</Text>
          <Text className="text-1xl text-center font-light text-white">{houseName}</Text>
        </View>
        <View className="mb-0 h-[200px] w-full flex-grow self-end overflow-hidden rounded-t-[40px] bg-white pb-24 pt-10">
          {pastLists && Object.keys(pastLists).length > 0 ? (
            <FlatList
              className="h-full"
              data={Object.keys(pastLists).reverse()}
              renderItem={renderItem}
              keyExtractor={item => item}
              contentContainerStyle={{ gap: 8 }}
            />
          ) : (
            <View className="flex flex-1 items-center justify-center">
              <View className="flex w-3/4 items-center justify-center">
                <Image source={emptyList} resizeMode="contain" />
                <Text className="text-center text-3xl font-semibold text-apricot">
                  Your list is empty!
                </Text>
                <Text className="text-1xl text-center text-apricot">
                  Hit the "home" button to begin creating your shared list
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
