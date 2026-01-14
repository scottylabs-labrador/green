import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';

import LogoutConfirm from '@/components/LogoutConfirm';
import HouseInfo from '../../components/HouseInfo';

import { useHouseInfo } from '@/context/HouseContext';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { houseId, houseName, color, ownerId, members } = useHouseInfo();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [userId, setUserId] = useState(user?.uid || '');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.uid && user.uid !== userId) {
        setUserId(user.uid);
      }
      if (user.email && user.email !== email) {
        setEmail(user.email);
      }
      if (user.displayName && user.displayName !== name) {
        setName(user.displayName);
      }
    } else {
      router.replace('/login');
    }
  }, [user, user?.displayName, user?.email]);

  const handleEditProfile = () => {
    router.push('/editprofile');
  };

  const handleAccountSettings = () => {
    router.push('/accountsettings');
  }

  const handleSwitchHouse = () => {
    router.push('/houses');
  }

  const handleJoinHouse = () => {
    router.push('/choosehouse');
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(!showLogoutConfirm);
  }

  return (
    <View className="h-full w-full flex-1 items-center justify-start overflow-y-auto">
      <View className="flex h-full w-full max-w-lg items-center justify-start gap-1 pb-6 pt-16 px-8">
        <View
          className="ml-1 flex h-24 w-24 items-center justify-center self-center rounded-full"
          style={{ backgroundColor: `${color}` }}
        >
          <Text className="text-center text-4xl text-white">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-center text-xl font-bold">{name}</Text>
        <Text className="pb-4 text-center text-sm text-gray-500">{email}</Text>

        <View className="w-full flex-col items-center justify-center gap-2">
          <Text className="w-full px-1 text-left font-medium text-gray-500">House</Text>
          <HouseInfo name={houseName} houseId={houseId} members={members} owner={ownerId} onNameChange={() => {}} />
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
            onPress={handleSwitchHouse}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">Switch House</Text>
            </View>
          </Pressable>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
            onPress={handleJoinHouse}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">New House</Text>
            </View>
          </Pressable>
        </View>

        <View className="w-full flex-col items-center justify-center gap-3 mt-2">
          <Text className="w-full px-1 text-left font-medium text-gray-500">Account</Text>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
            onPress={handleEditProfile}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">Edit Profile</Text>
            </View>
          </Pressable>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
            onPress={handleAccountSettings}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">Account Settings</Text>
            </View>
          </Pressable>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100" 
            onPress={handleLogoutConfirm}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold text-red-500">Log Out</Text>
            </View>
          </Pressable>
        </View>
        <LogoutConfirm 
          visible={showLogoutConfirm} 
          onClose={handleLogoutConfirm} 
        />
      </View>
    </View>
  );
}
