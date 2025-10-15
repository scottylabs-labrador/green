import React, { useEffect, useState } from 'react';

import { Link, useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import { Pressable, Text, View } from 'react-native';

import { onAuthChange } from '../../api/auth';
import { db, getCurrentUser, userSignOut } from '../../api/firebase';
import HouseInfo from '../../components/HouseInfo';

export default function Profile() {
  const [name, setName] = useState('Name');
  const [color, setColor] = useState('000000');
  const [email, setEmail] = useState('');
  const [houseName, setHouseName] = useState('House Name');
  const [houseId, setHouseId] = useState('House ID');
  const [members, setMembers] = useState({});

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(user => {
      if (!user) {
        router.replace('/login');
        return;
      }

      const email = getCurrentUser()?.email;
      if (!email) return;

      setEmail(email);
      const [emailUser, domain] = email.split('.');
      const filteredEmail = `${emailUser}:${domain}`;

      fetchUserData(filteredEmail);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (filteredEmail: string) => {
    try {
      const housemateSnap = await get(ref(db, `housemates/${filteredEmail}`));
      const houseId = housemateSnap.val()?.houses?.[0];

      console.log('house id: ', houseId);

      if (!houseId) return;

      setHouseId(houseId);

      const houseSnap = await get(ref(db, `houses/${houseId}`));
      const houseData = houseSnap.val();

      console.log('house data:', houseData);

      if (!houseData) return;

      setHouseName(houseData.name);
      setMembers(houseData.members);

      const userData = houseData.members[filteredEmail];
      if (userData) {
        console.log('user data:', userData);
        setName(userData.name);
        setColor(userData.color);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <View className="h-full w-full flex-1 items-center justify-start overflow-y-auto">
      <View className="flex h-full w-full max-w-lg items-center justify-start gap-1 pb-6 pt-16 px-8">
        <View
          className="ml-1 flex h-32 w-32 items-center justify-center self-center rounded-full"
          style={{ backgroundColor: `#${color}` }}
        >
          <Text className="text-center text-5xl text-white">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-center text-3xl font-bold">{name}</Text>
        <Text className="pb-4 text-center text-lg text-gray-500">{email}</Text>

        <View className="w-full flex-col items-center justify-center gap-2">
          <Text className="w-full px-1 text-left font-medium text-gray-500">Houses</Text>
          <HouseInfo name={houseName} houseid={houseId} members={members} />
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100" 
          >
            <Link href={'/choosehouse'} className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">Join House</Text>
            </Link>
          </Pressable>
        </View>

        <View className="w-full flex-col items-center justify-center gap-2 mt-2">
          <Text className="w-full px-1 text-left font-medium text-gray-500">Account</Text>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100" 
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold">Edit Profile</Text>
            </View>
          </Pressable>
          <Pressable 
            className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100" 
            onPress={userSignOut}
          >
            <View className="w-full flex-row items-center justify-center gap-3 px-3">
              <Text className="text-1xl grow text-left font-semibold text-red-500">Log Out</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
