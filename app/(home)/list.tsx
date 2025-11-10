import React, { useEffect, useState } from 'react';

import type { GroceryItems } from '@db/types';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, ListRenderItemInfo, Modal, NativeSyntheticEvent, Pressable, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';

import { getGroceryListId, listenForGroceryItems, writeGroceryItem } from '@/api/grocerylist';
import { getHouseId, listenForHouseInfo } from '@/api/house';
import Button from '@/components/CustomButton';
import GroceryItem from '@/components/GroceryItem';
import { useAuth } from '@/context/AuthContext';

import emptyList from '../../assets/empty-list.png';

export default function List() {
  const router = useRouter();
  const { user } = useAuth();
  const { grocerylist } = useLocalSearchParams<{ grocerylist: string }>();

  const [groceryItems, setGroceryItems] = useState<GroceryItems>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState('');
  const [userId, setUserId] = useState('');
  const [colors, setColors] = useState({});
  const [houseId, setHouseId] = useState('');
  const [houseName, setHouseName] = useState('');

  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1);
  const day = String(currentDate.getDate());
  const year = String(currentDate.getFullYear()).slice(-2);
  const date = `${month}.${day}.${year}`;

  useEffect(() => {
    const getGroceryList = async () => {
      const isValid = typeof grocerylist === 'string' && grocerylist.trim() !== '';

      if (!isValid && user && user.uid) {
        try {
          const groceryListId = await getGroceryListId(user.uid);
          router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
        } catch (err) {
          console.error("Error fetching grocery list ID:", err);
        }
      } else if (!user || !user.uid) {
        router.replace('/login');
      }
    };

    getGroceryList();
  }, [grocerylist, router, user]);

  useEffect(() => {
    const fetchHouseId = async () => {
      if (user && user.uid) {
        setUserId(user.uid);

        try {
          const id = await getHouseId(user.uid);
          setHouseId(id);
        } catch (err) {
          console.error("Error fetching house ID:", err);
        }
      } else {
        router.replace('/login');
      }
    }

    fetchHouseId();
  }, [user]);

  useEffect(() => {
    if (!houseId) return;

    try {
      const unsubscribe = listenForHouseInfo(houseId, (house) => {
        setHouseName(house.name || '');
        setColors(house.members || {});
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening for house info:", err);
    }
  }, [houseId]);

  useEffect(() => {
    if (!grocerylist) return;

    const unsubscribeItems = listenForGroceryItems(grocerylist, (items) => {
      setGroceryItems(items);
    });

    return () => unsubscribeItems();
  }, [grocerylist]);

  const toggleModal = () => setModalVisible(!modalVisible);

  const renderItem = ({ item }: ListRenderItemInfo<string>) => (
    <GroceryItem
      key={item}
      groceryListId={grocerylist}
      id={item}
      name={groceryItems[item]?.name}
      quantity={groceryItems[item]?.quantity}
      splits={groceryItems[item]?.splits}
      member={userId}
      colors={colors}
    />
  );

  const writeItem = () => {
    if (!item.trim()) return;
    writeGroceryItem(grocerylist, item, userId);
    setItem('');
    toggleModal();
  };

  const handleWriteItem = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    if (key === 'Enter') {
      writeItem();
    }
  };

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1">
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
              data={Object.keys(groceryItems)}
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
            <Text className="self-center text-center text-white font-semibold">See Past Lists</Text>
          </Pressable>
        </Link>
        <Pressable
          className="absolute bottom-6 right-8 h-20 w-20 items-center justify-center"
          onPress={toggleModal}
        >
          <Ionicons name="add-circle" size={76} color="#064e3b" />
        </Pressable>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
              <Ionicons name="close" size={24} onPress={toggleModal} className="absolute right-3 top-3"/>
              <Text className="self-center text-lg font-medium">Add Item</Text>
              <View className="px-2 my-4">
                <TextInput
                  className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm ${item ? 'text-gray-900' : 'text-gray-500'} focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                  onChangeText={setItem}
                  value={item}
                  placeholder="Item..."
                  onKeyPress={handleWriteItem}
                />
              </View>
              <Button buttonLabel="Add Item" onPress={writeItem} fontSize="text-sm"></Button>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
