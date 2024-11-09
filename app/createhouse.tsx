import { Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback } from "react";

import "../main.css";
import { writeHouseData } from "../api/firebase";

export default function Page() {
  const [name, onChangeName] = useState("");
  const [code, onChangeCode] = useState("");

  return (
    <View className="flex-1 items-center padding-24">
      <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
        <Text className="mb-9 text-4xl justify-left font-semibold">
          Create House
        </Text>
        <Text className="mb-2">House Name</Text>
        <TextInput
          className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
          onChangeText={onChangeName}
          value={name}
        />
        <Link href="/createhouse" asChild>
          <TouchableOpacity
            className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
            onPress={() => writeHouseData(name)}
          >
            <Text className="text-white text-center self-center">
              Create House
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
