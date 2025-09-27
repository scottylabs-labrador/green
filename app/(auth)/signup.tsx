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

import { createUser } from '../../api/firebase';
import background from '../../assets/home-background.png';
import BackButton from '../../components/BackButton';
import Button from '../../components/CustomButton';

async function handleSubmit(
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  phoneNumber: string,
) {
  // check that all fields are filled
  if (!email || !password || !confirmPassword || !name) {
    return 'Please fill missing fields.';
  }

  if (phoneNumber.length != 10) {
    return 'Invalid phone number.';
  }

  // check password is minimum length
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  // check that passwords match on register
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  // handle signup/login
  if (password === confirmPassword) {
    try {
      await createUser(name, phoneNumber, email, password);

      return '';
    } catch (err) {
      return 'Unable to create user. Please try again.';
    }
  }
}

export default function SignUp({ route, navigation, ...props }) {
  const [name, onChangeName] = useState('');
  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [confirmPassword, onChangeConfirmPassword] = useState('');
  const [errorText, onChangeErrorText] = useState('');
  const router = useRouter();

  return (
    <ImageBackground source={background} resizeMode="cover">
      <KeyboardAvoidingView
        className="padding-24 w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <View className="mx-auto mt-20 w-9/12 max-w-6xl flex-1 justify-center">
            <Text className="justify-left mb-9 text-4xl font-semibold">Registration</Text>
            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChangeText={onChangeName}
              value={name}
            />
            <Text className="mb-2">Phone Number</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChangeText={onChangePhoneNumber}
              value={phoneNumber}
            />
            <Text className="mb-2">Email</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChangeText={onChangeEmail}
              value={email}
            />
            <Text className="mb-2">Password</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChangeText={onChangePassword}
              secureTextEntry={true}
              value={password}
            />
            <Text className="mb-2">Confirm Password</Text>
            <TextInput
              className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChangeText={onChangeConfirmPassword}
              secureTextEntry={true}
              value={confirmPassword}
            />
            <Text className="text-red-500">{errorText}</Text>
            <Button
              buttonLabel="Sign Up"
              onPress={async () => {
                // writeUserData(name, email, phoneNumber);
                const result = await handleSubmit(
                  email,
                  password,
                  confirmPassword,
                  name,
                  phoneNumber,
                );

                if (result === '') {
                  router.push('/choosehouse');
                } else {
                  onChangeErrorText(result);
                }
              }}
            ></Button>
          </View>
          <BackButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
