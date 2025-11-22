import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

type AccountSecurityProps = {
  visible: boolean;
  onClose: () => void;
};

const AccountSecurity = ({ visible, onClose }: AccountSecurityProps) => {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium">Account Settings</Text>
          <View className="flex-col gap-2 mt-5">
            <Pressable 
              className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
              onPress={() => router.push('/changeemail')}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-3">
                <Text className="text-1xl grow text-left font-semibold">Change Email</Text>
              </View>
            </Pressable>
            <Pressable 
              className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
              onPress={() => router.push('/changepassword')}
            >
              <View className="w-full flex-row items-center justify-center gap-3 px-3">
                <Text className="text-1xl grow text-left font-semibold">Change Password</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AccountSecurity;
