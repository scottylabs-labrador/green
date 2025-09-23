import React, { useEffect, useState } from 'react';

import { get, getDatabase, ref } from 'firebase/database';
import { FlatList, Pressable, Text, View } from 'react-native';

import MatchedItem from '../../components/MatchedItem';

export default function MatchedBill() {
  // TODO: Implement the bill page
  // Returns an assignment of receipt items to grocery items,
  // also might have popups to resolve any unknown items.

  const [matchedItems, setMatchedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [item, onChangeItem] = useState('');
  const db = getDatabase();

  useEffect(() => {
    const fetchData = () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const receiptId = urlParams.get('grocerylist');
      setReceiptId(receiptId);
      const matchedItemRef = ref(db, 'grocerylists/' + receiptId + '/groceryitems');
      const unmatchedItemRef = ref(db, 'grocerylists/' + receiptId + '/groceryitems');
      get(matchedItemRef).then(snapshot => {
        const data = snapshot.val();
        setMatchedItems(data);
      });
    };
    fetchData();
  }, [db]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderMatchedItem = ({ item }) => {
    return (
      <MatchedItem
        key={item}
        id={item}
        name={matchedItems[item].name}
        // quantity={matchedItems[item].quantity}
        price={matchedItems[item].quantity}
        receiptId={receiptId}
      />
    );
  };

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1 bg-[#6d0846]">
        <View className="mb-6 mt-14 w-fit gap-2 self-center">
          <Text className="text-1xl text-center font-medium text-white">Scanned Receipt</Text>
          <Text className="text-center text-4xl font-medium text-white">List 423 Matched</Text>
          <View className="mt-1 w-[90%] flex-row self-center">
            <Text className="text-1xl grow text-left font-light text-white">
              Cross-referenced with list 4.23.24
            </Text>
            <Text className="text-1xl text-right font-light text-white">Change</Text>
          </View>
        </View>
        <View className="mb-24 flex h-[200px] w-full flex-grow gap-4 self-end overflow-hidden rounded-b-3xl rounded-t-[40px] bg-white px-4 pb-24 pt-6">
          <View className="flex-grow">
            {Object.keys(matchedItems).length > 0 ? (
              <FlatList
                className="h-full"
                data={Object.keys(matchedItems)}
                renderItem={renderMatchedItem}
                keyExtractor={item => item}
              />
            ) : (
              <View>
                <Text className="text-center text-3xl font-semibold">Your list is empty!</Text>
              </View>
            )}
          </View>
          <View className="absolute bottom-0 left-0 h-20 w-full px-4 py-2">
            <View className="ab flex-col">
              <Text className="font-semibold">Sort by:</Text>
            </View>
            <Pressable className="h-8 w-fit items-center justify-center self-end rounded-lg bg-emerald-900 px-4 py-2.5 hover:bg-gray-600">
              <Text className="self-center text-center text-white">Generate Totals</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
