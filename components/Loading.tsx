import React from 'react';

import { ActivityIndicator, Text, View } from 'react-native';

type LoadingProps = {
  message: string;
}

const Loading = ({ message }: LoadingProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
      <Text>{message}</Text>
    </View>
  );
};

export default Loading;
