import { Pressable } from "react-native";
import { useRouter, Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';

import React from 'react'

const BackButton = () => {
  const router = useRouter();
  
  return (
    <Link href="/" className="absolute w-fit h-fit top-10 left-8">
      <Pressable>
        <AntDesign 
          name="left" 
          size={24} 
          color="gray" />
      </Pressable>
    </Link>
  )
}

export default BackButton

