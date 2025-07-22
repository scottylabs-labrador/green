import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import LinkButton from "../../components/LinkButton";

import "../../main.css";

export default function House() {
  // TODO: Home page
  // Should this exist for users who

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="flex justify-center items-center max-w-lg w-full gap-6">
        <Text className="text-4xl font-bold text-center">Join a House!</Text>
        <View className="w-full flex flex-col items-center">
          <LinkButton buttonLabel="Create House" page="/createhouse" />
          <LinkButton buttonLabel="Join House" page="/joinhousecode" />
        </View>
      </View>
    </View>
  );
}
