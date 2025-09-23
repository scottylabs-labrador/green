import React from 'react';
import { Text, View } from 'react-native';
import LinkButton from '../../components/LinkButton';

import '../../main.css';

export default function House() {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="flex w-full max-w-lg items-center justify-center gap-6">
        <Text className="text-center text-4xl font-bold">Join a House!</Text>
        <View className="flex w-full flex-col items-center">
          <LinkButton buttonLabel="Create House" page="/createhouse" />
          <LinkButton buttonLabel="Join House" page="/joinhousecode" />
        </View>
      </View>
    </View>
  );
}
