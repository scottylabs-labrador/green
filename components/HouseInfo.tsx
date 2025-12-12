import React, { useEffect, useState } from 'react';

import type { Members } from '@db/types';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { getUserEmail } from '@/api/auth';

import { useRouter } from 'expo-router';
import InviteCode from './InviteCode';

type HouseInfoProps = {
  name: string;
  houseId: string;
  members: Members;
  owner: string;
  onNameChange: (newName: string) => void;
};

const HouseInfo = ({ name, houseId, members, owner, onNameChange }: HouseInfoProps) => {
  const router = useRouter();
  
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
    router.push('/edithouse');
  };
  const [showInviteCode, setShowInviteCode] = useState(false);
  const handleInviteCode = () => {
    setShowInviteCode(!showInviteCode);
  }
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEmails = async () => {
      const emails: Record<string, string> = {};

      for (const userId of Object.keys(members)) {
        try {
          emails[userId] = await getUserEmail(userId);
        } catch (err) {
          console.error(`Error fetching email for user ${userId}:`, err);
        }
      }
      setUserEmails(emails);
    }

    fetchEmails();
  }, [members]);

  const renderMembers = ({ item }: ListRenderItemInfo<string>) => {
    return (
      <View className="w-full flex-row items-center justify-center self-center py-1 gap-2">
        <View
          className={`flex w-8 h-8 items-center justify-center rounded-full`}
          style={{ backgroundColor: members[item].color }}
        >
          <Text className={`text-xs h-fit self-center text-center font-medium text-white`}>
            {members[item].name[0].toUpperCase()}
          </Text>
        </View>
        <View className="flex-col grow">
          <Text className="self-center text-left w-full">{members[item].name}</Text>
          <Text className="self-center text-left text-xs text-gray-500 w-full">
            {userEmails[item] || ''}
          </Text>
        </View>
        {item === owner && <Text className="text-gray-500 text-xs font-light mr-2">Owner</Text>}
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
              <View>
                <FlatList
                  className="h-full w-full pl-3 pr-2"
                  data={Object.keys(members)}
                  renderItem={renderMembers}
                  keyExtractor={item => item}
                />
              </View>
            )}
          </View>
          <View className="w-full flex-col px-1 mt-2 gap-2">
            <Pressable 
              className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 " 
              onPress={handleEditHouse}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left font-semibold">Edit House</Text>
                <Ionicons name="pencil" size={18} color="gray" />
              </View>
            </Pressable>
            <Pressable 
              className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100" 
              onPress={handleInviteCode}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left font-semibold">Invite Member</Text>
                <Feather name="user-plus" size={18} color="gray" />
              </View>
            </Pressable>
          </View>
        </View>
      )}
      <InviteCode houseId={houseId} visible={showInviteCode} onClose={handleInviteCode} />
    </View>
  );
};

export default HouseInfo;
