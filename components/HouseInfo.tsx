import React, { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import type { Members } from '../db/types';

import EditHouse from './EditHouse';
import InviteCode from './InviteCode';

type HouseInfoProps = {
  name: string;
  houseid: string;
  members: Members;
  onNameChange: (newName: string) => void;
};

const HouseInfo = ({ name, houseid, members, onNameChange }: HouseInfoProps) => {

  const [showInfo, setShowInfo] = useState(false);
  const handlePress = () => {
    setShowInfo(!showInfo);
  };
  const [showMembers, setShowMembers] = useState(true);
  const handlePressMembers = () => {
    setShowMembers(!showMembers);
  };
  const [showEdit, setShowEdit] = useState(false);
  const handleEditHouse = () => {
    setShowEdit(!showEdit);
  };
  const [showInviteCode, setShowInviteCode] = useState(false);
  const handleInviteCode = () => {
    setShowInviteCode(!showInviteCode);
  }

  const renderMembers = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <View className="w-full flex-row items-center justify-center self-center py-1">
        <Text className="w-1/3 grow self-center text-left">{members[item].name}</Text>
        <Text className="w-2/3 grow self-center text-right text-xs text-gray-500">
          {item.replaceAll(':', '.')}
        </Text>
      </View>
    );
  };

  return (
    <View className="w-full flex-col items-center justify-center self-center rounded-lg border border-gray-300 px-2">
      <Pressable
        className={`h-12 w-full flex-row items-center justify-center gap-3 self-center px-2`}
        onPress={handlePress}
      >
        <View className={`w-full flex-row items-center justify-center`}>
          <Text className="w-1/2 grow self-center text-left font-medium">{name}</Text>
          {showInfo 
            ? <MaterialIcons name="keyboard-arrow-up" size={24} color="gray" />
            : <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
          }
        </View>
      </Pressable>
      {showInfo && (
        <View className="w-full grow flex-col items-center justify-center self-center pb-2">
          <View className={`w-full border border-gray-300 rounded-lg ${showMembers && 'pb-2'}`}>
            <Pressable
              className="w-full h-10 flex-row items-center justify-center gap-3 self-center px-2"
              onPress={handlePressMembers}
            >
              <Text className="w-1/2 grow self-center text-left font-medium">Members ({Object.keys(members).length})</Text>
              {showMembers 
                ? <MaterialIcons name="keyboard-arrow-up" size={24} color="gray" />
                : <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
              }
            </Pressable>
            {showMembers && (
              <FlatList
                className="h-full w-full pl-3 pr-2"
                data={Object.keys(members)}
                renderItem={renderMembers}
                keyExtractor={item => item}
              />
            )}
          </View>
          <View className="w-full flex-col px-1 mt-2 gap-2">
            <Pressable className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 " onPress={handleEditHouse}>
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left">Edit House</Text>
                <Ionicons name="pencil" size={18} color="gray" />
              </View>
            </Pressable>
            <Pressable className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100" onPress={handleInviteCode}>
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left">Invite Member</Text>
                <Feather name="user-plus" size={18} color="gray" />
              </View>
            </Pressable>
          </View>
        </View>
      )}
      <EditHouse houseId={houseid} visible={showEdit} onClose={handleEditHouse} onNameChange={onNameChange} />
      <InviteCode houseId={houseid} visible={showInviteCode} onClose={handleInviteCode} />
    </View>
  );
};

export default HouseInfo;
