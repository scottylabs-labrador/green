import React, { useEffect, useState } from 'react';

import { FontAwesome6, Ionicons, Octicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { FlatList, Image, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import GroceryItem from '@/components/GroceryItem';
import { useAuth } from '@/context/AuthContext';

import { listenForGroceryItems } from '@/api/grocerylist';
import AddGroceryItem from '@/components/AddGroceryItem';
import ClearListConfirm from '@/components/ClearListConfirm';
import { ListOptions, OptionItem } from '@/components/ListOptions';
import { useHouseInfo } from '@/context/HouseContext';
import { GroceryItems } from '@db/types';
import emptyList from '../../assets/empty-list.png';

export default function List() {
  const router = useRouter();
  const { user } = useAuth();
  const { houseId, houseName, groceryListId, members } = useHouseInfo();

  const [groceryItems, setGroceryItems] = useState<GroceryItems>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmClearVisible, setConfirmClearVisible] = useState(false);

  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1);
  const day = String(currentDate.getDate());
  const year = String(currentDate.getFullYear()).slice(-2);
  const date = `${month}.${day}.${year}`;

  useEffect(() => {
    if (!groceryListId) return;

    try {
      const unsubscribeItems = listenForGroceryItems(groceryListId, (items) => {
        setGroceryItems(items);
      });

      return () => unsubscribeItems();
    } catch (err) {
      console.error("Error while fetching grocery items:", err);
      if (err instanceof Error && err.message.includes('Permission denied')) { 
        router.replace('/error');
      }
    }    
  }, [groceryListId]);

  const toggleModal = () => setModalVisible(!modalVisible);

  const renderItem = ({ item }: ListRenderItemInfo<string>) => (
    <GroceryItem
      key={item}
      groceryListId={groceryListId}
      id={item}
      name={groceryItems[item]?.name}
      quantity={groceryItems[item]?.quantity}
      splits={groceryItems[item]?.splits}
      member={user?.uid || ''}
      colors={members}
    />
  );

  const options: OptionItem[] = [
    { label: 'Clear All', 
      icon: <FontAwesome6 name='trash-can' size={18} color='#f56565' />, 
      color: '#f56565', 
      onPress: () => setConfirmClearVisible(!confirmClearVisible) 
    },
    {
      label: 'Switch House',
      icon: <Octicons name='arrow-switch' size={18} color='gray' />, 
      color: 'gray',
      onPress: () => router.push('/houses')
    },
  ];

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1">
        <View className="absolute top-8 right-7">
          <ListOptions options={options} />
        </View>
        <View className="mb-8 mt-16 flex h-16 flex-col items-center justify-center">
          <Text className="text-1xl text-center font-medium text-white">Home</Text>
          <Text className="text-center text-4xl font-medium text-white">This week's list</Text>
          <View className="w-60 flex-row justify-between">
            <Text className="text-1xl grow text-left font-light text-white">{houseName}</Text>
            <Text className="text-1xl text-right font-light text-white">{date}</Text>
          </View>
        </View>
        <View className="mb-0 h-[200px] w-full flex-grow self-end overflow-hidden rounded-t-[40px] bg-white pb-24 pt-6">
          <View className="justify-between h-10 w-full flex-row items-stretch self-center px-6">
            <Text className="text-1xl w-1/2 pl-4 text-left text-gray-400">Item</Text>
            <Text className="text-1xl w-1/4 pr-1 text-right text-gray-400">Split by</Text>
            <Text className="text-1xl w-16 mx-3 text-center text-gray-400">Quantity</Text>
          </View>
          {groceryItems && Object.keys(groceryItems).length > 0 ? (
            <FlatList
              className="h-full"
              data={Object.keys(groceryItems).reverse()}
              renderItem={renderItem}
              keyExtractor={item => item}
              contentContainerStyle={{ gap: 8 }}
            />
          ) : (
            <View className="flex flex-1 items-center justify-center">
              <View className="flex w-3/4 items-center justify-center">
                <Image source={emptyList} resizeMode="contain" />
                <Text className="text-center text-3xl font-semibold text-soft-green">
                  Your list is empty!
                </Text>
                <Text className="text-1xl text-center text-soft-green">
                  Hit the "add" button to begin creating your shared list
                </Text>
              </View>
            </View>
          )}
        </View>

        <Link href={{ pathname: '/pastlists', params: { houseId: houseId } }} asChild>
          <Pressable className="absolute bottom-8 left-10 h-fit w-fit items-center justify-center rounded-lg bg-emerald-900 px-4 py-2.5 shadow-lg hover:bg-emerald-950">
            <Text className="self-center text-center text-white font-semibold">See Past Receipts</Text>
          </Pressable>
        </Link>
        <Pressable
          className="absolute bottom-6 right-8 h-20 w-20 items-center justify-center"
          onPress={toggleModal}
        >
          <Ionicons name="add-circle" size={76} color="#064e3b" />
        </Pressable>

        <AddGroceryItem userId={user?.uid} groceryListId={groceryListId} visible={modalVisible} onClose={toggleModal} />
        <ClearListConfirm groceryListId={groceryListId} visible={confirmClearVisible} onClose={() => setConfirmClearVisible(!confirmClearVisible)} />
      </View>
    </View>
  );
}

