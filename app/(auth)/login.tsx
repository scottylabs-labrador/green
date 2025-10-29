import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getUserIdFromEmail, userSignIn } from '@/api/auth';
import { getGroceryListId, getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import BackButton from '@/components/BackButton';
import Button from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      if (user && user.email) {
        try {
          const userId = getUserIdFromEmail(user.email);
          const groceryListId = await getGroceryListId(userId);
          router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
        } catch (err) {
          console.error('Error checking user grocery list:', err);
          router.replace('/choosehouse');
        }
      }
    }

    checkUser();
  }, [user]);

  const handleLogin = async () => {
    try {
      await userSignIn(email, password);
    } catch (err) {
      console.log('Login error:', err);
      setErrorText('Invalid email or password.');
      return;
    }

    try {
      const userId = getUserIdFromEmail(email);
      const houseId = await getHouseId(userId);

      if (!houseId) {
        router.push('/choosehouse');
        return;
      }

      const groceryListId = await getGroceryListIdFromHouse(houseId);
      if (groceryListId) {
        router.push({ pathname: '/list', params: { grocerylist: groceryListId } });
      } else {
        router.push('/choosehouse');
      }
    } catch (err) {
      console.log('Error while redirecting:', err);
      router.push('/choosehouse');
      return;
    }
  };

  return (
    <ImageBackground source={background} resizeMode="cover">
      <KeyboardAvoidingView
        className="padding-24 w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="h-full">
          <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
            <Text className="mb-9 text-4xl font-semibold">Log In</Text>

            <Text className="mb-2">Email</Text>
            <TextInput
              className="mb-4 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text className="mb-2">Password</Text>
            <TextInput
              className="mb-4 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />

            <Text className="mb-4 text-red-500">{errorText}</Text>

            <Button buttonLabel="Log In" onPress={handleLogin} />
          </View>

          <BackButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
