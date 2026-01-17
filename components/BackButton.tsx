import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

const BackButton = () => {
  const router = useRouter();

  return (
    <View className="absolute top-8 left-6">
      <Ionicons name="arrow-back" size={24} onPress={() => router.back()}/>
    </View>
  );
};

export default BackButton;
