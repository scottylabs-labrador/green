import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { getHouseId, listenForHouseInfo } from '@/api/house';
import { useAuth } from '@/context/AuthContext';

import AccountSettings from '@/components/AccountSettings';
import LogoutConfirm from '@/components/LogoutConfirm';
import EditProfile from '../../components/EditProfile';
import HouseInfo from '../../components/HouseInfo';
import Loading from '../../components/Loading';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [houseName, setHouseName] = useState('');
  const [houseId, setHouseId] = useState('');
  const [members, setMembers] = useState({});

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouseId = async () => {
      if (user && user.uid) {
        setUserId(user.uid);

        if (user.email) {
          setEmail(user.email);
        }

        try {
          const id = await getHouseId(user.uid);
          setHouseId(id);
        } catch (err) {
          console.error("Error fetching house ID:", err);
        }
      } else {
        router.replace('/login');
      }
    }

    fetchHouseId();
  }, [user]);

  useEffect(() => {
    if (!houseId || !userId) return;

    try {
      const unsubscribe = listenForHouseInfo(houseId, (house) => {
        const members = house.members || {};

        setHouseName(house.name);
        setMembers(members);

        const userData = members[userId];
        if (userData) {
          setName(userData.name);
          setColor(userData.color);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening for house info:", err);
    }
  }, [houseId, userId]);

  const handleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };

  const handleAccountSettings = () => {
    setShowAccountSettings(!showAccountSettings);
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(!showLogoutConfirm);
  }

  if (loading) {
    return (
      <Loading message={"Loading user..."} />
    )
  }

  return (
    <View className="h-full w-full flex-1 items-center justify-start overflow-y-auto">
      <View className="flex h-full w-full max-w-lg items-center justify-start gap-1 pb-6 pt-16 px-8">
        <View
          className="ml-1 flex h-32 w-32 items-center justify-center self-center rounded-full"
          style={{ backgroundColor: `${color}` }}
        >
          <Text className="text-center text-5xl text-white">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-center text-3xl font-bold">{name}</Text>
        <Text className="pb-4 text-center text-lg text-gray-500">{email}</Text>

        <View className="w-full flex-col items-center justify-center gap-2">
          <Text className="w-full px-1 text-left font-medium text-gray-500">House</Text>
          <HouseInfo name={houseName} houseid={houseId} members={members} onNameChange={setHouseName} />
        </View>

        <View className="w-full flex-col items-center justify-center gap-2 mt-2">
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
        <EditProfile 
          userId={userId} 
          name={name} 
          houseId={houseId} 
          color={color}
          visible={showEditProfile} 
          onClose={handleEditProfile} 
          onNameChange={setName} 
          onColorChange={setColor}
        />
        <LogoutConfirm 
          visible={showLogoutConfirm} 
          onClose={handleLogoutConfirm} 
        />
        <AccountSettings 
          visible={showAccountSettings}
          onClose={handleAccountSettings}
        />
      </View>
    </View>
  );
}
