import React from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';

import BackButton from '@/components/BackButton';
import { useRouter } from 'expo-router';

export default function AccountSettings() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      className="padding-24 w-full flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="h-full">
        <BackButton />
        <View className="mx-auto mt-16 flex-1 justify-center w-full px-8">
          <Text className="text-center text-lg font-medium">Account Settings</Text>
            <View className="flex-col gap-2 mt-5">
              <Pressable 
                className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
                onPress={() => router.push('/changeemail')}
              >
                <View className="w-full flex-row items-center justify-center gap-3 px-3">
                  <Text className="text-1xl grow text-left font-semibold">Change Email</Text>
                </View>
              </Pressable>
              <Pressable 
                className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
                onPress={() => router.push('/changepassword')}
              >
                <View className="w-full flex-row items-center justify-center gap-3 px-3">
                  <Text className="text-1xl grow text-left font-semibold">Change Password</Text>
                </View>
              </Pressable>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
