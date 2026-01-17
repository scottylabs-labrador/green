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
    if (!user?.uid) {
      return;
    }

    if (!user.emailVerified) {
      router.replace('/verifyemail');
      return;
    }

    router.replace('/list');
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

    if (!user?.uid) {
      setErrorText('Failed to retrieve user information.');
      setLoading(false);
      return;
    }

    router.push('list');
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
              className="mb-4 block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900"
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
