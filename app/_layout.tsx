import React, { useEffect, useState } from 'react';

import { Redirect, SplashScreen, Stack, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { getGroceryListId } from '@/api/grocerylist';

import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();

  const [userDataLoading, setUserDataLoading] = useState(true);
  const [groceryListId, setGroceryListId] = useState('');

  const segments = useSegments();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const id = await getGroceryListId(user.uid);
          setGroceryListId(id);
        } catch (err) {
          console.error("No grocery list ID found for user:", err);
        }
      }
      setUserDataLoading(false);
    };

    if (!loading) {
      SplashScreen.hideAsync();
      fetchUserData();
    }
  }, [user, loading]);

  if (loading || userDataLoading) {
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

  // Redirect authenticated user to their grocery list
  if (user && isAuthGroup) {
    if (groceryListId) {
      return <Redirect href={{ pathname: '/list', params: { grocerylist: groceryListId } }} />;
    } else {
      return <Redirect href="/choosehouse" />;
    }
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <RootLayoutNav />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}