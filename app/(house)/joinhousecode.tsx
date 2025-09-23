import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import { Text, TextInput, View } from 'react-native';

import { db } from '../../api/firebase';
import { getHouseIdFromInvite } from '../../api/house';
import CustomButton from '../../components/CustomButton';

export default function JoinHouseCode() {
  const [code, onChangeCode] = useState('');
  const [houses, setHousesItem] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
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
      if (houseId) {
        router.push({
          pathname: '/joinhouse',
          params: { key: houseId },
        });
      }
    } catch (err) {
      console.error('Error while validing code: ', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
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
        {error ? <Text className="mb-4 text-red-500">Error: {error}</Text> : <View></View>}
        <CustomButton buttonLabel="Join House" onPress={redirectToHouse}></CustomButton>
      </View>
    </View>
  );
}
