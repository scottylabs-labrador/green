import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ref, get } from 'firebase/database';
import { getCurrentUser, userSignOut, db } from '../../api/firebase';
import { onAuthChange } from '../../api/auth';
import HouseInfo from '../../components/HouseInfo';
import Button from '../../components/CustomButton';
import { useRouter } from 'expo-router';

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

      if (!houseId) return;

      setHouseId(houseId);

      const houseSnap = await get(ref(db, `houses/${houseId}`));
      const houseData = houseSnap.val();

      if (!houseData) return;

      setHouseName(houseData.name);
      setMembers(houseData.members);

      const userData = houseData.members[filteredEmail];
      if (userData) {
        setName(userData.name);
        setColor(userData.color);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-start p-6">
      <View className="flex w-full max-w-lg items-center justify-center gap-1 pt-10">
        <View
          className="ml-1 flex h-32 w-32 items-center justify-center self-center rounded-full"
          style={{ backgroundColor: `#${color}` }}
        >
          <Text className="text-center text-5xl text-white">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-center text-3xl font-bold">{name}</Text>
        <Text className="pb-4 text-center text-lg text-gray-500">{email}</Text>

        <View className="mb-32 w-full flex-col items-center justify-center">
          <Text className="w-full px-5 text-left text-lg font-medium text-gray-500">Houses</Text>
          <HouseInfo name={houseName} houseid={houseId} members={members} />
        </View>

        <Button buttonLabel="Logout" onPress={userSignOut} />
      </View>
    </View>
  );
}
