import React from 'react';

import { EmailProvider } from '@/context/EmailContext';
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <EmailProvider>
      <View className="bg-white flex-1 justify-between mb-0">
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    </EmailProvider>
  );
}
