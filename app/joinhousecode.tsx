import { Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { router } from "expo-router";

import "../main.css";
import { writeGroceryItem } from "../api/firebase";

export default function Page() {
  // TODO: Implement the list page
  // Display a list of grocery items
  // Allow users to add, remove, and update items
  const [code, onChangeCode] = useState("");

  function stuff() {
    const db = getDatabase();
    const itemRef = ref(db, "houses/");
    onValue(itemRef, (snapshot) => {
      const data = snapshot.val();
      var keys = Object.keys(data);
      if (keys.includes(code)) {
        console.log("yay");
        router.replace("/joinhouse");
        return true;
      } else {
        console.log("boo");
        return false;
      }
    });
  }

  return (
    <View className="flex-1 items-center padding-24">
      <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
        <Text className="mb-9 text-4xl justify-left font-semibold">
          Join a House
        </Text>
        <Text className="mb-2">Enter Code</Text>
        <TextInput
          className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
          onChangeText={onChangeCode}
          value={code}
        />
        <TouchableOpacity
          className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
          onPress={() => stuff()}
        >
          <Text className="text-white text-center self-center">Join House</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
