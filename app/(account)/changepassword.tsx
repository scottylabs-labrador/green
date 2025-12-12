import React, { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';

import { reauthenticateAndChangePassword, userSignOut } from '@/api/auth';
import BackButton from '@/components/BackButton';
import Button from '@/components/CustomButton';
import SecureTextInput from '@/components/SecureTextInput';
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
        <BackButton />
        <View className="mx-auto mt-16 flex-1 justify-center w-full px-8">
          <Text className="mb-6 text-center text-lg font-medium">Change Password</Text>
          <View className="px-2 mb-2">
            <Text className="mb-2">Current Password</Text>
            <SecureTextInput value={currPassword} onChangeText={setCurrPassword} />
            <Text className="text-blue-500 font-medium text-right mb-2" onPress={() => router.push('/forgotpassword')}>
              Forgot Password?
            </Text>
          </View>
          <View className="px-2 mb-2">
            <Text className="mb-2">New Password</Text>
            <SecureTextInput value={newPassword} onChangeText={setNewPassword} />
          </View>
          <View className="px-2 mb-2">
            <Text className="mb-2">Confirm Password</Text>
            <SecureTextInput value={confirmPassword} onChangeText={setConfirmPassword} />
          </View>

          <Text className="mb-4 text-red-500">{errorText}</Text>

          <Button buttonLabel="Reset Password" onPress={handleChangePassword} isLoading={loading} fontSize={"text-sm"} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
