import React from 'react';

import { Redirect, SplashScreen, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isAuthGroup = segments[0] === '(auth)';

  // Redirect to login if not authenticated
  if (!user && !isAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MenuProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <RootLayoutNav />
          </SafeAreaView>
        </SafeAreaProvider>
      </MenuProvider>
    </AuthProvider>
  );
}