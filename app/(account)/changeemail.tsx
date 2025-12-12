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

import { reauthenticateAndChangeEmail } from '@/api/auth';
import BackButton from '@/components/BackButton';
import Button from '@/components/CustomButton';
import SecureTextInput from '@/components/SecureTextInput';
import { useAuth } from '@/context/AuthContext';

export default function ChangeEmail() {
  const router = useRouter();
  const { user } = useAuth();

  const [currPassword, setCurrPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!user?.email) {
      return;
    }

    setLoading(true);

    if (newEmail !== confirmEmail) {
      setErrorText('Emails do not match.');
      setLoading(false);
      return;
    }

    try {
      await reauthenticateAndChangeEmail(newEmail, currPassword);
      setLoading(false);
      router.push('/verifyemail');
    } catch (err) {
      console.error("Error while changing email:", err);
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
          <Text className="mb-6 text-center text-lg font-medium">Change Email</Text>
          <View className="px-2 mb-2">
            <Text className="mb-2">New Email</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900"
              onChangeText={setNewEmail}
              value={newEmail}
              keyboardType="email-address"
            />
          </View>
          <View className="px-2 mb-2">
            <Text className="mb-2">Confirm Email</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900"
              onChangeText={setConfirmEmail}
              value={confirmEmail}
              keyboardType="email-address"
            />
          </View>
          <View className="px-2 mb-2">
            <Text className="mb-2">Current Password</Text>
            <SecureTextInput value={currPassword} onChangeText={setCurrPassword} />
            <Text className="text-blue-500 font-medium text-right mb-2" onPress={() => router.push('/forgotpassword')}>
              Forgot Password?
            </Text>
          </View>

          <Text className="mb-4 text-red-500">{errorText}</Text>

          <Button buttonLabel="Change Email" onPress={handleChangeEmail} isLoading={loading} fontSize={"text-sm"}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
