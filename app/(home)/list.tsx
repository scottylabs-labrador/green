import React, { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';
import { FlatList, Image, ListRenderItemInfo, Modal, NativeSyntheticEvent, Pressable, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';

import { onAuthChange } from '../../api/auth';
import { getGroceryListId, writeGroceryItem } from '../../api/grocerylist';
import emptyList from '../../assets/empty-list.png';
import GroceryItem from '../../components/GroceryItem';
import type { GroceryItems } from '../../db/types';

export default function List() {
  const router = useRouter();
  const { grocerylist } = useLocalSearchParams<{ grocerylist: string }>();

  const isValid = typeof grocerylist === 'string' && grocerylist.trim() !== '';
  if (!isValid) {
    const auth = getAuth();
    onAuthStateChanged(auth, async user => {
      if (user && user.email) {
        const groceryListId = await getGroceryListId(user.email);
        router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
      }
    });
  }

  const [groceryItems, setGroceryItems] = useState<GroceryItems>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState('');
  const [email, setEmail] = useState('email');
  const [colors, setColors] = useState({});
  const [houseId, setHouseId] = useState('');
  const [houseName, setHouseName] = useState('');
  const [date, setDate] = useState('');

  const db = getDatabase();

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(user => {
      if (user) {
        const email = user.email || '';
        const filteredEmail = email.split('.').join(':');
        setEmail(filteredEmail);

        const itemRef = ref(db, 'housemates/' + filteredEmail);
        onValue(itemRef, snapshot => {
          const data = snapshot.val();
          if (data?.houses?.[0]) {
            const houses = data.houses[0].toString();
            setHouseId(houses);

            const houseRef = ref(db, 'houses/' + houses);
            onValue(houseRef, snapshot => {
              const data = snapshot.val();
              if (data) {
                setColors(data.members || {});
                setHouseName(data.name || '');
              }
            });
          }
        });
      } else {
        // Redirect to login if no user found
        router.replace('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [db, router]);

  useEffect(() => {
    if (!grocerylist) return;

    const itemRef = ref(db, `grocerylists/${grocerylist}/groceryitems`);
    const unsubscribeItems = onValue(itemRef, snapshot => {
      const data = snapshot.val();
      setGroceryItems(data || {});
    });

    return () => unsubscribeItems();
  }, [db, grocerylist]);

  useEffect(() => {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1);
    const day = String(currentDate.getDate());
    const year = String(currentDate.getFullYear()).slice(-2);
    setDate(`${month}.${day}.${year}`);
  }, []);

  const toggleModal = () => setModalVisible(!modalVisible);

  const renderItem = ({ item }: ListRenderItemInfo<string>) => (
    <GroceryItem
      key={item}
      groceryListId={grocerylist}
      id={item}
      name={groceryItems[item]?.name}
      quantity={groceryItems[item]?.quantity}
      splits={groceryItems[item]?.splits}
      member={email}
      colors={colors}
    />
  );

  const writeItem = () => {
    if (!item.trim()) return;
    writeGroceryItem(grocerylist, item, email);
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
          <View className="justify-left h-10 w-full flex-row items-stretch self-center px-6">
            <Text className="text-1xl w-1/2 pl-4 text-left text-gray-400">Item</Text>
            <Text className="text-1xl w-1/4 pr-1 text-right text-gray-400">Split by</Text>
            <Text className="text-1xl w-20 pr-3 text-right text-gray-400">Quantity</Text>
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
            <Text className="self-center text-center text-white">See Past Items</Text>
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
            <View className="align-center m-auto h-fit w-2/3 rounded-lg bg-white px-7 py-5 shadow-md">
              <Ionicons name="close" size={24} onPress={toggleModal} />
              <Text className="self-center">Add Item</Text>
              <TextInput
                className="my-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChangeText={setItem}
                value={item}
                placeholder="Add Item..."
                onKeyPress={handleWriteItem}
              />
              <Pressable
                className="w-fit self-center rounded-lg bg-emerald-900 px-4 py-2.5 hover:bg-gray-600"
                onPress={writeItem}
              >
                <Text className="self-center text-center text-white">Add</Text>
              </Pressable>
              <Pressable className="mt-6 w-fit self-center rounded-lg bg-emerald-900 px-4 py-2.5 hover:bg-gray-600">
                <Text className="self-center text-center text-white">See All Past Items</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
