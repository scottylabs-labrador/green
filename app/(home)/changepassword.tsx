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

import { reauthenticateAndChangePassword, userSignOut } from '@/api/auth';
import Button from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export default function ChangePassword() {
  const router = useRouter();
  const { user } = useAuth();

  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user?.email) {
      return;
    }

    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorText('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await reauthenticateAndChangePassword(currPassword, newPassword);
      setLoading(false);
      userSignOut();
    } catch (err) {
      console.error("Error while changing password:", err);
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
        <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="mb-9 text-3xl font-semibold">Change Password</Text>

          <Text className="mb-2">Current Password</Text>
          <TextInput
            className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            onChangeText={setCurrPassword}
            value={currPassword}
            secureTextEntry
          />
          <Text className="text-blue-500 font-medium text-right mb-2" onPress={() => router.push('/forgotpassword')}>
            Forgot Password?
          </Text>

          <Text className="mb-2">New Password</Text>
          <TextInput
            className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />

          <Text className="mb-2">Confirm Password</Text>
          <TextInput
            className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />

          <Text className="mb-4 text-red-500">{errorText}</Text>

          <Button buttonLabel="Reset Password" onPress={handleChangePassword} isLoading={loading}/>
          <Text className={`text-center mt-2 text-blue-500 font-medium`} onPress={() => {router.back();}}>
            Back
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
