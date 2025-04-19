import React, { useState } from 'react';
import { FlatList, Pressable, Text, View, Modal, TextInput } from "react-native";
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
        <Text className = 'text-lg grow text-left w-1/3 self-center'>{members[item].name}</Text>
        <Text className = 'text-lg grow text-right w-2/3 self-center text-gray-500'>{item.replaceAll(":", ".")}</Text>
      </View>
    );
  }

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View className="w-[90%] my-2 border border-gray-300 rounded-lg">
       <Pressable className={
          `flex-row items-center justify-center w-full h-12 self-center px-2 gap-3 rounded-lg border-gray-300`
          } onPress={handlePress}>
        <View className={showInfo ? `w-full flex-row border-b-2 py-1 border-gray-300` : `w-full flex-row`}>
          <Text className="text-lg grow text-left w-1/2 self-center font-medium">{name}</Text>
          <Link href={'/'} className="flex items-center justify-center">
              <Ionicons
                name="pencil" 
                size={20} 
                color="black"
                className="w-1/8 p-2"/>
          </Link>
        </View>
        </Pressable>
    {showInfo &&
      <View className="flex-col items-center justify-center w-full grow self-center">
        <View className="flex-row items-center justify-center w-full py-1 self-center px-3 gap-3">
          <Text className = 'text-lg font-medium grow text-left w-1/3 self-center'>House ID</Text>
          <Text className = 'text-lg grow text-right w-2/3 self-center text-gray-500'>{houseid}</Text>
        </View>
        <Pressable className="flex-row items-center justify-center w-full py-1 self-center px-3 gap-3" onPress={handlePressMembers}>
          <Text className = 'text-lg font-medium grow text-left w-1/2 self-center'>Members</Text>
          <Text className = 'text-lg grow text-right w-1/2 self-center text-gray-500'>{Object.keys(members).length}</Text>
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

    <Modal 
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      >
      <View className="w-2/3 h-1/3 m-auto bg-white rounded-lg p-10 align-center">
          <Ionicons
              name='close'
              size={24}
              onPress={toggleModal}/>
          <Text className="self-center">Add Item</Text>
          <TextInput
              className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
              onChangeText={() => {}}
              value={""}
              placeholder="Add Item..."
              onKeyPress={() => {}}
          />
          <Pressable 
              className="bg-[#3e5636] hover:bg-gray-600 py-2.5 px-4 w-fit self-center rounded-lg"
              onPress={() => {}}
              >
              <Text className="text-white text-center self-center">Add</Text>
          </Pressable>
          <Pressable 
              className="bg-[#3e5636] hover:bg-gray-600 mt-6 py-2.5 px-4 w-fit self-center rounded-lg"
              >
              <Text className="text-white text-center self-center">See All Past Items</Text>
          </Pressable>
      </View>
      </Modal>
    </View>
  )
}

export default HouseInfo