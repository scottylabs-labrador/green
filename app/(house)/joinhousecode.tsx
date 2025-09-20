import { Text, TextInput, View } from 'react-native';

import { get, getDatabase, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../components/CustomButton';

import '../../main.css';

import { useRouter } from 'expo-router';
import { getHouseIdFromInvite } from '../../api/house';

export default function Page() {
  // TODO: Implement the list page
  // Display a list of grocery items
  // Allow users to add, remove, and update items
  const [code, onChangeCode] = useState('');
  const [houses, setHousesItem] = useState([]);
  const [error, setError] = useState('');
  const db = getDatabase();
  const itemRef = ref(db, 'houses/');
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const itemRef = ref(db, 'houses/');
      get(itemRef).then(snapshot => {
        const data = snapshot.val();
        setHousesItem(data);
      });
    };
    fetchData();
  }, []);

  async function redirectToHouse() {
    try {
      const houseId = await getHouseIdFromInvite(code);
      window.location.href = '/joinhouse?key=' + houseId;
    } catch (err) {
      console.error("Error while validing code: ", err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  function stuff(code: string) {
    onChangeCode(code);
    console.log(code);
    return false;
  }

  function test() {
    console.log(code);
  }

  return (
    <View className="padding-24 flex-1 items-center">
      <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left mb-9 text-4xl font-semibold">Join a House</Text>
        <Text className="mb-2">Enter Code</Text>
        <TextInput
          className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChangeText={onChangeCode}
          value={code}
        />
        {error ? 
         <Text className="text-red-500 mb-4">Error: {error}</Text> 
        : <View></View>}
        <CustomButton buttonLabel="Join House" onPress={redirectToHouse}></CustomButton>
      </View>
    </View>
  );
}
