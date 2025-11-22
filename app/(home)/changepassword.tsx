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
        <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="mb-9 text-3xl font-semibold">Change Password</Text>

          <Text className="mb-2">Current Password</Text>
          <SecureTextInput value={currPassword} onChangeText={setCurrPassword} />
          <Text className="text-blue-500 font-medium text-right mb-2" onPress={() => router.push('/forgotpassword')}>
            Forgot Password?
          </Text>

          <Text className="mb-2">New Password</Text>
          <SecureTextInput value={newPassword} onChangeText={setNewPassword} />

          <Text className="mb-2">Confirm Password</Text>
          <SecureTextInput value={confirmPassword} onChangeText={setConfirmPassword} />

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
