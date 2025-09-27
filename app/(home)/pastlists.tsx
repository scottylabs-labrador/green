import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, getDatabase, ref } from 'firebase/database';
import { FlatList, Image, Text, View } from 'react-native';

import emptyList from '../../assets/empty-list.png';
import PastList from '../../components/PastList';

export default function PastLists() {
  const router = useRouter();

  const { houseId } = useLocalSearchParams();

  const [pastLists, setPastLists] = useState({});
  const [houseName, setHouseName] = useState('Your House');
  const db = getDatabase();

  useEffect(() => {
    const fetchData = () => {
      const receiptRef = ref(db, 'houses/' + houseId);
      get(receiptRef).then(snapshot => {
        const data = snapshot.val();
        if (data) {
          if (data.receipts) {
            setPastLists(data.receipts);
          }
          if (data.name) {
            setHouseName(data.name);
          }
        }
      });
    };
    fetchData();
  }, [db]);

  const renderItem = ({ item }) => {
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
