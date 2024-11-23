import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

import React from 'react'

const BackButton = () => {
  const router = useRouter();
  
  return (
    <Pressable onPress={() => router.back()} className="absolute w-fit h-fit top-10 left-8" >
      <AntDesign 
        name="left" 
        size={24} 
        color="gray" />
    </Pressable>
  )
}

export default BackButton

