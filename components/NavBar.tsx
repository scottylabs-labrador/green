import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Link, useSegments } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const NavBar = () => {
  const segments = useSegments();
  const [location, setLocation] = useState('');

  const SELECTED_COLOR = 'pink';

  useEffect(() => {
    setLocation(segments[segments.length - 1]);
  }, [segments]);

  return (
    <View className="h-16 w-full items-center justify-center bg-white">
      <View className="flex w-3/4 flex-row justify-between space-x-4">
        <Link href={{ pathname: '/list' }} asChild>
          <Ionicons
            name="home"
            size={24}
            color={location == 'profile' || location == 'scan' ? 'gray' : SELECTED_COLOR}
          />
        </Link>
        <Link href="/scan" asChild>
          <Ionicons name="camera" size={24} color={location == 'scan' ? SELECTED_COLOR : 'gray'} />
        </Link>
        <Link href="/profile" asChild>
          <FontAwesome
            name="user-circle"
            size={24}
            color={location == 'profile' ? SELECTED_COLOR : 'gray'}
          />
        </Link>
      </View>
    </View>
  );
};

export default NavBar;
