import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import { userPasswordResetEmail } from '@/api/auth';
import BackButton from '@/components/BackButton';
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
    <KeyboardAvoidingView
      className="padding-24 w-full flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="h-full">
        <BackButton/>
        <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="mb-3 text-2xl font-semibold">Reset Password</Text>

          <Text className="text-gray-500 mb-9">
            Enter your email address and we will send you instructions to reset your password. 
          </Text>

          <Text className="mb-2">Email</Text>
          <TextInput
            className="mb-4 block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="mb-4 text-red-500">{errorText}</Text>

          <Button buttonLabel="Send Reset Link" onPress={handleForgotPassword} isLoading={loading}/>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
