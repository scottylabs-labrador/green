import React from 'react'
import { View, Text } from 'react-native'

const SplitProfile = ({ colors, item, size, fontSize, quantity }) => {
  try{
    return (
      <View className="overflow-visible">
        <View className={`ml-1 w-${size} h-${size} rounded-full self-center flex items-center justify-center`} style={{ backgroundColor: "#"+ colors[item].color}}>
          <Text className={`text-${fontSize} self-center text-center text-white h-fit font-medium`}>{colors[item].name[0].toUpperCase()}</Text>
        </View>
        <View className={`absolute -bottom-0 -right-1 rounded-full w-4 h-4 bg-emerald-950 items-center justify-center`}>
          <Text className={`text-xs text-white text-center`}>{quantity}</Text>
        </View>
      </View>
    );
  }
  catch{
      return (
          <View className={`ml-1 w-${size} h-${size} rounded-full self-center flex items-center justify-center`} style={{ backgroundColor: "#FFFFFF"}}>
            <Text className={`text-${fontSize} self-center text-center text-white h-fit`}>U</Text>
          </View>
        );
  }
}

export default SplitProfile