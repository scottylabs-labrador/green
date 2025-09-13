import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function GroupPage() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Welcome to Group: {id}</Text>
    </View>
  );
}
