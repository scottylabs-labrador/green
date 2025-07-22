import { View, ImageBackground } from "react-native";
import { Slot, Stack, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import background from "../../assets/background.png";

export default function HomeLayout() {
  const segments = useSegments();
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    const page = segments[segments.length - 1];
    switch (page) {
      case "list":
        setBgColor("bg-dark-green");
        break;
      case "bill":
        setBgColor("bg-magenta");
        break;
      case "unmatched":
        setBgColor("bg-magenta");
        break;
      case "message":
        setBgColor("bg-magenta");
        break;
      case "pastlists":
        setBgColor("bg-carrot");
        break;
      default:
        setBgColor("bg-white");
        break;
    }
  }, [segments]);

  return (
    <ImageBackground
      source={background}
      className={`flex-1 ${bgColor} h-screen w-screen overflow-hidden`}
      resizeMode="stretch"
    >
      <View style={{ flex: 1, justifyContent: "space-between", marginBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <NavBar />
      </View>
    </ImageBackground>
  );
}

