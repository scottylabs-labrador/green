import '../../main.css';

import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { ImageBackground, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import background from '@/assets/home-background.png';
import LinkButton from '@/components/LinkButton';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

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

  return (
    <KeyboardAvoidingView
      className={`padding-24 w-full flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={background}
        resizeMode="cover"
        className="h-full w-full bg-dark-green overflow-hidden"
      >
        <View className="h-full w-full flex-1 items-center justify-center p-6">
          <View className="flex h-fit max-w-lg items-center justify-center gap-6">
            <View>
              <Text className="text-center text-4xl font-bold text-sunflower">Welcome to</Text>
              <Text className="text-center text-7xl font-bold text-sunflower">Green</Text>
            </View>
            <View className="flex w-full flex-col items-center">
              <LinkButton
                buttonLabel="Sign Up"
                page="/signup"
                color="bg-sunflower-70"
                hoverColor="hover:bg-dark-sunflower-70"
              />
              <LinkButton
                buttonLabel="Log In"
                page="/login"
                color="bg-sunflower-70"
                hoverColor="hover:bg-dark-sunflower-70"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
