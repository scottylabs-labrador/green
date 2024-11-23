import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import LinkButton from "../components/LinkButton";

import "../main.css";

export default function House() {
  // TODO: Home page
  // Should this exist for users who

  return (
    <View className="flex-1 items-center padding-24">
      <View className="flex-1 justify-center max-w-4xl mx-auto gap-14">
        <Text className="text-4xl font-bold self-center">Join a House!</Text>
        <View className="flex flex-column gap-2">
          <LinkButton buttonLabel="Create House" page="/createhouse" />
          <LinkButton buttonLabel="Join House" page="/joinhousecode" />
        </View>
      </View>
    </View>
  );
}
