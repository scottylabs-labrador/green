import React, { useEffect, useState } from 'react';

import { Slot, useSegments } from 'expo-router';
import { ImageBackground, View } from 'react-native';

import { HouseProvider } from '@/context/HouseContext';
import background from '../../assets/background.png';
import NavBar from '../../components/NavBar';

export default function HomeLayout() {
  const segments = useSegments();
  const [bgColor, setBgColor] = useState('bg-white');

  useEffect(() => {
    const page = segments[segments.length - 1];
    switch (page) {
      case 'list':
        setBgColor('bg-dark-green');
        break;
      case 'bill':
        setBgColor('bg-magenta');
        break;
      case 'unmatched':
        setBgColor('bg-magenta');
        break;
      case 'message':
        setBgColor('bg-magenta');
        break;
      case 'pastlists':
        setBgColor('bg-carrot');
        break;
      default:
        setBgColor('bg-white');
        break;
    }
  }, [segments]);

  return (
    <HouseProvider>
      <ImageBackground
        source={background}
        className={`flex-1 ${bgColor} h-screen w-screen overflow-hidden`}
        resizeMode="stretch"
      >
        <View style={{ flex: 1, justifyContent: 'space-between', marginBottom: 0 }}>
          <View style={{ flex: 1 }}>
            <Slot />
          </View>
          <NavBar />
        </View>
      </ImageBackground>
    </HouseProvider>
  );
}
