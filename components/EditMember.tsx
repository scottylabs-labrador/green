import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { removeMember, updateOwner } from '@/api/house';
import { Members } from '@/backend/functions/src/db/types';
import { useHouseInfo } from '@/context/HouseContext';
import { Feather } from '@expo/vector-icons';

type EditMemberProps = {
  visible: boolean;
  memberId: string;
  houseId: string;
  userEmails: Record<string, string>;
  members: Members;
  onClose: () => void;
};

const EditMember = ({ visible, memberId, onClose }: EditMemberProps) => {
  const { houseId, userEmails, members } = useHouseInfo();
  
  const [error, setError] = useState('');
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  
  const transferOwnership = async () => {
    try {
      setLoadingOwner(true);
      await updateOwner(houseId, memberId);
      setLoadingOwner(false);
      onClose();
    } catch (err) {
      console.error("Error transferring ownership:", err);
      setError("Failed to transfer ownership.");
    }
  };

  const handleRemoveMember = async () => {
    try {
      setLoadingRemove(true);
      await removeMember(houseId, memberId);
      setLoadingRemove(false);
      onClose();
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member.");
    }
  };
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <View className="flex-row items-center justify-center mb-2">
            <View
              className={`mr-2 flex w-8 h-8 items-center justify-center rounded-full`}
              style={{ backgroundColor: members[memberId]?.color }}
            >
              <Text className={`text-xs h-fit self-center text-center font-medium text-white`}>
                {members[memberId]?.name[0].toUpperCase()}
              </Text>
            </View>
            <Text className="text-center text-lg font-medium">{members[memberId]?.name}</Text>
          </View>
          <Text className="text-center text-sm text-gray-500 mb-4">{userEmails[memberId]}</Text>
          <View className="w-full flex-col px-1 mt-2 mb-6 gap-2">
            <Pressable 
              className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 " 
              onPress={transferOwnership}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left font-semibold">Make Owner</Text>
                {loadingOwner ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Feather name="user-check" size={18} color="gray" />
                )}
              </View>
            </Pressable>
            <Pressable 
              className="flex h-10 w-full items-center justify-center self-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100" 
              onPress={handleRemoveMember}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-2">
                <Text className="text-1xl grow text-left text-red-500 font-semibold">Remove Member</Text>
                {loadingRemove ? (
                  <ActivityIndicator size="small" color="#f56565" />
                ) : (
                  <Feather name="user-minus" size={18} color="#f56565" />
                )}
              </View>
            </Pressable>
          </View> 
          {error.length > 0 && (
            <Text className="text-red-500 mb-3 px-2">
              Error: {error}
            </Text>
          )}    
        </View>
      </View>
    </Modal>
  );
};

export default EditMember;
