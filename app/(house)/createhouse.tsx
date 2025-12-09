import React, { useState } from 'react';

import { router } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { writeGroceryList } from '@/api/grocerylist';
import { joinHouse, writeHouse } from '@/api/house';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export default function CreateHouse() {
  const { user } = useAuth();
  
  const [name, onChangeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function redirectToJoin(name: string) {
    const housecode = window.crypto.randomUUID();
    const grocerylist = window.crypto.randomUUID();
    const defaultColor = '#ca3a31';

    if (!user || !user.uid) {
      router.replace('/login');
      return;
    }

    setLoading(true);

    try {
      await writeHouse(name, housecode, grocerylist);
      await writeGroceryList(grocerylist, name, housecode);
      await joinHouse(housecode, user.uid, defaultColor);
      router.push({
        pathname: '/joinhouse',
        params: { key: housecode },
      });
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error("Error while creating house:", err);
    }
  }

  return (
    <View className="padding-24 flex-1 items-center">
      <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left mb-9 text-4xl font-semibold">Create House</Text>
        <Text className="mb-2">House Name</Text>
        <TextInput
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChangeText={onChangeName}
          value={name}
        />
        {error && 
          <Text className="text-red-500 mb-4">
            Error: {error}
          </Text>
        }
        <View className="flex-row items-center justify-evenly mt-5 w-fit self-center gap-4">
          <CustomButton buttonLabel="Back" onPress={() => router.back()} />
          <CustomButton buttonLabel="Create House" onPress={() => redirectToJoin(name)} isLoading={loading}></CustomButton>
        </View>
      </View>
    </View>
  );
}
