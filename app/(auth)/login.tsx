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

import { userSignIn } from '@/api/auth';
import { getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import Button from '@/components/CustomButton';
import SecureTextInput from '@/components/SecureTextInput';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user?.uid) {
          return;
        }

        if (!user.emailVerified) {
          router.push('/verifyemail');
          return;
        }
  
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
      }
    }

    checkUser();
  }, [user]);

  const handleLogin = async () => {
    setLoading(true);
    let user;

    try {
      user = await userSignIn(email, password);
    } catch (err) {
      console.log('Login error:', err);
      if (err instanceof Error) {
        setErrorText(err.message);
      }
      setLoading(false);
      return;
    }

    try {
      if (!user?.uid) {
        setErrorText('Failed to retrieve user information.');
        setLoading(false);
        return;
      }

      const houseId = await getHouseId(user.uid);

      if (!houseId) {
        router.push('/choosehouse');
        return;
      }

      const groceryListId = await getGroceryListIdFromHouse(houseId);
      console.log("grocery list id:", groceryListId);
      if (groceryListId) {
        console.log("redirecting to list");
        router.push({ pathname: '/list', params: { grocerylist: groceryListId } });
      } else {
        router.push('/choosehouse');
      }
    } catch (err) {
      console.log('Error while redirecting:', err);
      router.push('/choosehouse');
    }
  };

  return (
    <ImageBackground 
      source={background}
      className={`flex-1 bg-white h-screen w-screen overflow-hidden`}
      imageStyle={{ opacity: 0.5 }}
      resizeMode="stretch"
    >
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
            <SecureTextInput value={password} onChangeText={setPassword} className="mb-10" />
            <Text className="text-blue-500 font-medium text-right mb-2" onPress={() => router.push('/forgotpassword')}>
              Forgot Password?
            </Text>

            <Text className="mb-4 text-red-500">{errorText}</Text>

            <Button buttonLabel="Log In" onPress={handleLogin} isLoading={loading}/>

            <Text className="text-center mt-2">
              Don't have an account?{' '}
              <Text className="text-blue-500 font-medium" onPress={() => router.push('/signup')}>
                Sign up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
