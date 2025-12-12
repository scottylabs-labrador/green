import React from 'react';

import { Slot } from 'expo-router';
import { View } from 'react-native';

import { HouseProvider } from '@/context/HouseContext';
import NavBar from '../../components/NavBar';

export default function ProfileLayout() {
  return (
    <HouseProvider>
      <View className="bg-white flex-1 justify-between mb-0">
        <View className="flex-1">
          <Slot />
        </View>
        <NavBar />
      </View>
    </HouseProvider>
  );
}
