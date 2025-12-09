import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';

import { getHouseIdFromInvite, getHouseNameFromServer, joinHouse } from '@/api/house';
import CustomButton from '@/components/CustomButton';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';

export default function JoinHouseCode() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [code, onChangeCode] = useState('');
  const [loadingHouse, setLoadingHouse] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [houseId, setHouseId] = useState('');
  const [houseName, setHouseName] = useState('');
  const [error, setError] = useState('');

  async function validateCode() {
    if (!user || !user.uid) {
      router.replace('/login');
      return;
    }

    setLoadingHouse(true);

    try {
      const id = await getHouseIdFromInvite(code);
      if (id) {
        setValidCode(true);
        setHouseId(id);
        const name = await getHouseNameFromServer(id);
        setHouseName(name);
      } else {
        setError('Invalid or expired code');
      }

      setLoadingHouse(false);
    } catch (err) {
      console.error('Error while validing code: ', err);
      if (err instanceof Error) {
        setError(err.message);
      }

      setLoadingHouse(false);
    }
  }

  async function redirectToHouse() {
    if (!user || !user.uid) {
      router.replace('/login');
      return;
    }

    const defaultColor = '#ca3a31';
    setLoadingJoin(true);
    
    try {
      await joinHouse(houseId, user.uid, defaultColor);
      setLoadingJoin(false);
      router.push({
        pathname: '/joinhouse',
        params: { key: houseId },
      });
    } catch (err) {
      console.error('Error while validing code: ', err);
      if (err instanceof Error) {
        setError(err.message);
      }
      setLoadingJoin(false);
    }
  }

  if (loadingHouse) {
    return (
      <Loading message="Loading house..." />
    );
  }

  return (
    <View className="padding-24 flex-1 items-center">
      {validCode ? (
        <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="text-center mb-1 text-4xl font-semibold">Join</Text>
          <Text className="text-center mb-9 text-3xl font-semibold">{houseName}?</Text>
          {error ? <Text className="mb-4 text-red-500">Error: {error}</Text> : <View></View>}
          <View className="flex-row items-center justify-evenly mt-5 w-fit self-center gap-4">
            <CustomButton buttonLabel="Back" onPress={() => setValidCode(false)} />
            <CustomButton buttonLabel="Join House" onPress={redirectToHouse} isLoading={loadingJoin}></CustomButton>
          </View>
        </View>
      ) : (
        <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="justify-left mb-9 text-4xl font-semibold">Join a House</Text>
          <Text className="mb-2">Enter Code</Text>
          <TextInput
            className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChangeText={onChangeCode}
            value={code}
          />
          {error ? <Text className="mb-4 text-red-500">Error: {error}</Text> : <View></View>}
          <View className="flex-row items-center justify-evenly mt-5 w-fit self-center gap-4">
            <CustomButton buttonLabel="Back" onPress={() => router.back()} />
            <CustomButton buttonLabel="Join House" onPress={validateCode} isLoading={loadingHouse}></CustomButton>
          </View>
        </View>
      )}
      
    </View>
  );
}
