import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router"; 

type HouseInfoProps = {
  name: string;
  houseid: string;
  members: {};
};

const HouseInfo = ({ name, houseid, members }: HouseInfoProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const handlePress = () => {
    setShowInfo(!showInfo);
  };
  const [showMembers, setShowMembers] = useState(false);
  const handlePressMembers = () => {
    setShowMembers(!showMembers);
  };

  const renderMembers = ({ item }) => {
    return (
      <View className="flex-row items-center justify-center w-full py-1 self-center pl-1">
        <Text className = 'text-[18px] grow text-left w-1/3 self-center'>{members[item].name}</Text>
        <Text className = 'text-[18px] grow text-right w-2/3 self-center text-gray-500'>{item}</Text>
      </View>
    );
  }

  return (
    <View className="w-[90%] my-2 border border-gray-300 rounded-lg">
       <Pressable className={
      `flex-row items-center justify-center w-full h-12 self-center px-2 gap-3 rounded-lg bg-gray-300`
      } onPress={handlePress}>
        <Text className="text-2xl grow text-left w-1/2 self-center font-bold">{name}</Text>
        <Link href={'/'}>
            <Ionicons
              name="pencil" 
              size={24} 
              color="black"
              className="w-1/8 p-2"/>
        </Link>
        </Pressable>
    {showInfo &&
      <View className="flex-col items-center justify-center w-full grow self-center">
        <View className="flex-row items-center justify-center w-full py-1 self-center px-3 gap-3">
          <Text className = 'text-[18px] grow text-left w-1/3 self-center'>House ID</Text>
          <Text className = 'text-[18px] grow text-right w-2/3 self-center text-gray-500'>{houseid}</Text>
        </View>
        <Pressable className="flex-row items-center justify-center w-full py-1 self-center px-3 gap-3" onPress={handlePressMembers}>
          <Text className = 'text-[18px] grow text-left w-1/2 self-center'>Members</Text>
          <Text className = 'text-[18px] grow text-right w-1/2 self-center text-gray-500'>{Object.keys(members).length}</Text>
        </Pressable>
        {
          showMembers && <FlatList
                              className="h-full w-full pl-6 pr-2"
                              data={Object.keys(members)}
                              renderItem={renderMembers}
                              keyExtractor={item => item}
                              />
        }
      </View>
    }
    </View>
  )
}

export default HouseInfo