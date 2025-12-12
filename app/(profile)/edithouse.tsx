import React, { useEffect, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import { updateHouseName } from '@/api/house';
import BackButton from '@/components/BackButton';
import Button from '@/components/CustomButton';
import EditMember from '@/components/EditMember';
import { useAuth } from '@/context/AuthContext';
import { useHouseInfo } from '@/context/HouseContext';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EditHouse() {
  const router = useRouter();
  const { user } = useAuth();

  const { houseId, houseName, ownerId, userEmails, members } = useHouseInfo();

  const [newHouseName, setNewHouseName] = useState(houseName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editMember, setEditMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState('');

  useEffect(() => {
    setEditMember(false);
  }, []);

  const saveChanges = async () => {
    setLoading(true);

    if (newHouseName && newHouseName.length > 0) {
      try {
        await updateHouseName(newHouseName, houseId);
      } catch (err) {
        console.error("Error when changing house name:", err);
        setLoading(false);
        setError("Failed to update house name.");
        return;
      }
    }

    setLoading(false);

    router.push('/profile');
  }

  const handleEditMember = (memberId: string) => {
    setEditMemberId(memberId);
    setEditMember(true);
  }

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
        {item === ownerId && <Text className="text-gray-500 text-xs font-light">Owner</Text>}
        {item !== user?.uid && <Entypo name="chevron-small-right" size={24} color="gray" onPress={() => handleEditMember(item)} />}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="padding-24 w-full flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="h-full">
        <BackButton />
        <View className="mx-auto mt-16 flex-1 justify-center w-full px-8">
          <Text className="text-center text-lg font-medium mb-6">Edit House</Text>
          <View className="px-2 mb-4">
            <Text className="mb-2">Name</Text>
            <TextInput
              className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setNewHouseName}
              value={newHouseName}
              autoCapitalize="none"
            />
          </View>
          {ownerId === user?.uid && (
            <View className="px-2 mt-2 mb-6">
              <Text className="mb-2">Members</Text>
              <FlatList
                className="h-full w-full pl-1"
                data={Object.keys(members)}
                renderItem={renderMembers}
                keyExtractor={item => item}
              />
              
            </View>
          )}
          {error.length > 0 && (
            <Text className="text-red-500 mb-3 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm" isLoading={loading}></Button>        
        </View>
        <EditMember visible={editMember} memberId={editMemberId} houseId={houseId} userEmails={userEmails} members={members} onClose={() => setEditMember(false)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
