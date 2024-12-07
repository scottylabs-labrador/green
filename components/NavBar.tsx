import React from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { Ionicons, FontAwesome } from '@expo/vector-icons'

const NavBar = () => {
  return (
    <View className="justify-center bg-white h-16 w-full fixed bottom-0 items-center m-0">
      <View className="w-3/4 flex-row flex space-x-4 justify-between">
          <Link href="/" asChild>
              <Ionicons
                  name="home" 
                  size={24} 
                  color="pink"/>
          </Link>
          <Link href="/scan" asChild>
              <Ionicons
                  name='camera'
                  size={24}
                  color="gray"/>
          </Link>
          <Link href="/" asChild>
              <FontAwesome
                  name='user-circle'
                  size={24}
                  color="gray"/>
          </Link>
      </View>
  </View>
  )
}

export default NavBar