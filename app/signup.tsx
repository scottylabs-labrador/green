import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import BackButton from '../components/BackButton';
import { writeUserData } from "../api/firebase";
import { createUser } from "../api/firebase";
import { useRouter } from "expo-router";
import Button from "../components/CustomButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getGroceryListId } from "../api/grocerylist";

async function handleSubmit(
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  phoneNumber: string,
) {
  // check that all fields are filled
  if (!email || !password || !confirmPassword || !name) {
    return "Please fill missing fields.";
  }

  if (phoneNumber.length != 10) {
    return "Invalid phone number.";
  }

  // check password is minimum length
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  // check that passwords match on register
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  // handle signup/login
  if (password === confirmPassword) {
    try {
      await createUser(name, phoneNumber, email, password);

      return "";
    } catch (err) {
      return "Unable to create user. Please try again.";
    }
  }
}

export default function SignUp({ route, navigation, ...props }) {
  const [name, onChangeName] = useState("");
  const [phoneNumber, onChangePhoneNumber] = useState("");
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [errorText, onChangeErrorText] = useState("");
  const router = useRouter();

  const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("user signed in: ", user);
          getGroceryListId()
            .then(groceryListId => 
              router.replace(
                {pathname: '/list', 
                params: { grocerylist: groceryListId }
                }));
        }
      });
    
  return (
    <KeyboardAvoidingView className="flex-1 w-full padding-24" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mt-20">
          <Text className="mb-9 text-4xl justify-left font-semibold ">
            Registration
          </Text>
          <Text className="mb-2">Name</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangeName}
            value={name}
          />
          <Text className="mb-2">Phone Number</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangePhoneNumber}
            value={phoneNumber}
          />
          <Text className="mb-2">Email</Text>
          <TextInput
            className="block  bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangeEmail}
            value={email}
          />
          <Text className="mb-2">Password</Text>
          <TextInput
            className="block  bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangePassword}
            secureTextEntry={true}
            value={password}
          />
          <Text className="mb-2">Confirm Password</Text>
          <TextInput
            className="block  bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangeConfirmPassword}
            secureTextEntry={true}
            value={confirmPassword}
          />
          <Text className="text-red-500">{errorText}</Text>
          <Button
            buttonLabel = "Sign Up"
            onPress={async () => {
              // writeUserData(name, email, phoneNumber);
              const result = await handleSubmit(
                email,
                password,
                confirmPassword,
                name,
                phoneNumber,
              );

              if (result === "") {
                router.push("/choosehouse");
              } else {
                onChangeErrorText(result);
              }
            }}
          >
          </Button>
        </View>
        <BackButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
