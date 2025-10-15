import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { userSignIn } from '../../api/firebase';
import { getGroceryListId } from '../../api/grocerylist';
import background from '../../assets/home-background.png';
import BackButton from '../../components/BackButton';
import Button from '../../components/CustomButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const router = useRouter();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user && user.email) {
        console.log('User signed in:', user.email);
        try {
          const groceryListId = await getGroceryListId(user.email);
          router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
        } catch (err) {
          console.error('Error when redirecting to grocery list:', err);
          router.push('/choosehouse');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await userSignIn(email, password);

      const emailKey = email.replace(/\./g, ':'); // Replace dots with colons
      const houseRef = ref(db, `housemates/${emailKey}`);
      const houseSnap = await get(houseRef);

      if (!houseSnap.exists()) {
        console.log('No house data found, redirecting...');
        router.push('/choosehouse');
        return;
      }

      const houses = houseSnap.val().houses;
      if (!houses || houses.length === 0) {
        console.log('No houses array in data');
        router.push('/choosehouse');
        return;
      }

      const houseId = houses[0];
      const houseDataSnap = await get(ref(db, `houses/${houseId}`));

      if (!houseDataSnap.exists()) {
        console.log('House data not found');
        router.push('/choosehouse');
        return;
      }

      const grocerylist = houseDataSnap.val().grocerylist;
      if (grocerylist) {
        router.push({ pathname: '/list', params: { grocerylist } });
      } else {
        router.push('/choosehouse');
      }
    } catch (err) {
      console.log('Login error:', err);
      setErrorText('Invalid email or password.');
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
