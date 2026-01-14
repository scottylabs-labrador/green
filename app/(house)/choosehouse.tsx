import React from 'react';

import { Text, View } from 'react-native';

import LinkButton from '@/components/LinkButton';
import { useHouseInfo } from '@/context/HouseContext';
import { useRouter } from 'expo-router';

export default function House() {
  const router = useRouter();
  const { houseId, houseName } = useHouseInfo();
  
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="flex w-full max-w-lg items-center justify-center gap-6">
        <Text className="text-center text-4xl font-bold bg-red">Join a House!</Text>
        <View className="flex w-full flex-col items-center">
          <LinkButton buttonLabel="Create House" page="/createhouse" />
          <LinkButton buttonLabel="Join House" page="/joinhousecode" />
        </View>
      </View>
      {houseId && (
        <Text 
          className="text-center font-medium text-blue-500 my-1"
          onPress={() => router.push('/list')}
        >
          Back to {houseName}
        </Text>
      )}
    </View>
  );
}
