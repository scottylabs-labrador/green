import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';

import { userPasswordResetEmail } from '@/api/auth';
import Button from '@/components/CustomButton';
import { useEmail } from '@/context/EmailContext';
import Entypo from '@expo/vector-icons/Entypo';

export default function CheckEmail() {
  const router = useRouter();
  const { email } = useEmail();

  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleForgotPassword = async () => {
    if (cooldown > 0) return;

    try {
      setLoading(true);
      await userPasswordResetEmail(email);

      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.log("Error when handling forgot password:", err);
      if (err instanceof Error) {
        setErrorText(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="padding-24 w-full flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="h-full">
        <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
          <View className="w-full items-center justify-center mb-5">
            <Entypo name="mail-with-circle" size={96} color="#064e3b" />
          </View>
          <Text className="mb-3 text-3xl text-center font-semibold">Check your email</Text>

          <Text className="text-gray-500 text-center mb-4">
            We've sent a password reset link to 
          </Text>
          <Text className="font-medium text-center mb-5">
            {email}
          </Text>

          <Text className="mb-4 text-red-500">{errorText}</Text>

          <Button buttonLabel="Done" onPress={() => router.push('/login')}/>

          <Text className={`text-center mt-2 ${cooldown > 0 || loading ? 'text-gray-500' : 'text-blue-500'} font-medium`} onPress={handleForgotPassword}>
            Resend Email
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
