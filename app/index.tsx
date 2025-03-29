import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import LinkButton from "../components/LinkButton";
import "../main.css";

// const Stack = createStackNavigator();

export default function Home() {
  // TODO: Home page
  // Should this exist for users who

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="flex justify-center items-center max-w-lg w-full gap-6">
        <Text className="text-4xl font-bold text-center">Welcome to Green</Text>
        <View className="w-full flex flex-col items-center">
          <LinkButton buttonLabel="Sign Up" page="/signup" />
          <LinkButton buttonLabel="Login" page="/login" />
        </View>
      </View>
    </View>
  );
}
