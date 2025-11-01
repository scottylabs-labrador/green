import React from 'react';

import { Slot } from 'expo-router';
import { ImageBackground, View } from 'react-native';

import background from '../../assets/home-background.png';

export default function HomeLayout() {
  return (
    <ImageBackground
      source={background}
      className={`flex-1 bg-white h-screen w-screen overflow-hidden`}
      imageStyle={{ opacity: 0.5 }}
      resizeMode="stretch"
    >
      <View style={{ flex: 1, justifyContent: 'space-between', marginBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </View>
    </ImageBackground>
  );
}
