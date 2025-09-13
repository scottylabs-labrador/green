import React, { useState } from 'react';
import { FlatList, Pressable, Text, View, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import EditHouse from './EditHouse';

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
  const [showEdit, setShowEdit] = useState(false);
  const handleEditHouse = () => {
    setShowEdit(!showEdit);
  };

  const renderMembers = ({ item }) => {
    return (
      <View className="w-full flex-row items-center justify-center self-center py-1 pl-1">
        <Text className="w-1/3 grow self-center text-left text-lg">{members[item].name}</Text>
        <Text className="w-2/3 grow self-center text-right text-lg text-gray-500">
          {item.replaceAll(':', '.')}
        </Text>
      </View>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View className="w-[90%] flex-col items-center justify-center self-center rounded-lg border border-gray-300 px-2">
      <Pressable
        className={`h-12 w-full flex-row items-center justify-center gap-3 self-center rounded-lg border-gray-300 px-2`}
        onPress={handlePress}
      >
        <View
          className={
            showInfo
              ? `w-full flex-row items-center justify-center border-b-2 border-gray-300 py-1`
              : `w-full flex-row items-center justify-center`
          }
        >
          <Text className="w-1/2 grow self-center text-left text-lg font-medium">{name}</Text>
          <Pressable className="flex items-center justify-center" onPress={handleEditHouse}>
            <Ionicons name="pencil" size={20} color="black" className="w-1/8 p-2" />
          </Pressable>
        </View>
      </Pressable>
      {showInfo && (
        <View className="w-full grow flex-col items-center justify-center self-center">
          {/* <View className="flex-row items-center justify-center w-full py-1 self-center px-3 gap-3">
          <Text className = 'text-lg font-medium grow text-left w-1/3 self-center'>House ID</Text>
          <Text className = 'text-lg grow text-right w-2/3 self-center text-gray-500'>{houseid}</Text>
        </View> */}
          <Pressable
            className="w-full flex-row items-center justify-center gap-3 self-center px-3 py-1"
            onPress={handlePressMembers}
          >
            <Text className="w-1/2 grow self-center text-left text-lg font-medium">Members</Text>
            <Text className="w-1/2 grow self-center text-right text-lg text-gray-500">
              {Object.keys(members).length}
            </Text>
          </Pressable>
          {showMembers && (
            <FlatList
              className="h-full w-full pl-6 pr-2"
              data={Object.keys(members)}
              renderItem={renderMembers}
              keyExtractor={item => item}
            />
          )}
        </View>
      )}
      <EditHouse houseId={houseid} visible={showEdit} onClose={handleEditHouse} />
    </View>
  );
};

export default HouseInfo;
