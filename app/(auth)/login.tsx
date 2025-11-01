import React, { useState } from 'react';

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

import { userSignIn } from '@/api/auth';
import { getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import BackButton from '@/components/BackButton';
import Button from '@/components/CustomButton';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleLogin = async () => {
    let userCredential;
    try {
      userCredential = await userSignIn(email, password);
    } catch (err) {
      console.log('Login error:', err);
      if (err instanceof Error) {
        setErrorText(err.message);
      }
      return;
    }

    try {
      if (!userCredential || !userCredential.user || !userCredential.user.uid) {
        return;
      }

      const user = userCredential.user;
      const houseId = await getHouseId(user.uid);

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
