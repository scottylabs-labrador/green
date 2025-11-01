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

import { createUser } from '@/api/auth';
import { getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import Button from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, onChangeName] = useState('');
  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [confirmPassword, onChangeConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user?.uid) {
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

  const handleSubmit = async () => {
    setLoading(true);
  
    // check that passwords match on register
    if (password !== confirmPassword) {
      setErrorText('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await createUser(name, phoneNumber, email, password);
      router.push('/choosehouse');
    } catch (err) {
      if (err instanceof Error) {
        setErrorText(err.message);
      }
      setLoading(false);
    }
  }

  return (
    <ImageBackground 
      source={background}
      className={`flex-1 bg-white h-screen w-screen overflow-hidden`}
      imageStyle={{ opacity: 0.5 }}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingVertical: 64,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto w-9/12 max-w-6xl">
            <Text className="mb-7 text-4xl font-semibold">Registration</Text>

            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={onChangeName}
              value={name}
            />

            <Text className="mb-2">Phone Number</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={onChangePhoneNumber}
              value={phoneNumber}
            />

            <Text className="mb-2">Email</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={onChangeEmail}
              value={email}
            />

            <Text className="mb-2">Password</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={onChangePassword}
              secureTextEntry
              value={password}
            />

            <Text className="mb-2">Confirm Password</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={onChangeConfirmPassword}
              secureTextEntry
              value={confirmPassword}
            />

            <Text className="text-red-500 mb-4">{errorText}</Text>

            <Button
              buttonLabel="Sign Up"
              onPress={() => handleSubmit()}
              isLoading={loading}
            />

            <Text className="text-center">
              Already have an account?{' '}
              <Text
                className="text-blue-500 font-medium"
                onPress={() => router.push('/login')}
              >
                Log in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
