import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView  } from "react-native";
import BackButton from '../components/BackButton';
import { userSignIn } from "../api/firebase";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import Button from "../components/CustomButton";

async function handleSubmit(email: string, password: string) {
  try {
    await userSignIn(email, password);

    return "";
  } catch (error) {
    return "Invalid email or password.";
  }
}

export default function Login() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorText, onChangeErrorText] = useState("");
  const router = useRouter();

  return (
    <KeyboardAvoidingView className="flex-1 w-full padding-24" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
          <Text className="mb-9 text-4xl justify-left font-semibold">Login</Text>
          <Text className="mb-2">Email</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangeEmail}
            value={email}
          />
          <Text className="mb-2">Password</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangePassword}
            secureTextEntry={true}
            value={password}
          />
          <Text className="text-red-500">{errorText}</Text>
          <Button buttonLabel="Login" onPress={async () => {
            // writeUserData(name, email, phoneNumber);
            const result = await handleSubmit(email, password);

            if (result === "") {
              router.push("/choosehouse");
            } else {
              onChangeErrorText(result);
            }
          }}>
        </Button>
        </View>
        <BackButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
