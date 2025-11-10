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

import { userPasswordResetEmail } from '@/api/auth';
import background from '@/assets/home-background.png';
import Button from '@/components/CustomButton';
import { useEmail } from '@/context/EmailContext';

export default function ForgotPassword() {
  const router = useRouter();
  const { email, setEmail } = useEmail();

  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await userPasswordResetEmail(email);
      router.push('/checkemail');
    } catch (err) {
      console.log("Error when handling forgot password:", err);
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
        className="padding-24 w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="h-full">
          <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
            <Text className="mb-3 text-4xl font-semibold">Reset Password</Text>

            <Text className="text-gray-500 mb-9">
              Enter your email address and we will send you instructions to reset your password. 
            </Text>

            <Text className="mb-2">Email</Text>
            <TextInput
              className="mb-4 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text className="mb-4 text-red-500">{errorText}</Text>

            <Button buttonLabel="Send Reset Link" onPress={handleForgotPassword} isLoading={loading}/>

            <Text className="text-center mt-2 text-blue-500 font-medium" onPress={() => router.push('/login')}>
              Back to log in
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
