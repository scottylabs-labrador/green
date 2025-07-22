import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { ref, get } from 'firebase/database';
import { getCurrentUser, userSignOut, db } from '../../api/firebase';
import { onAuthChange } from '../../api/auth';
import HouseInfo from '../../components/HouseInfo';
import Button from '../../components/CustomButton';
import { useRouter } from "expo-router";

export default function Profile() {
  const [name, setName] = useState('Name');
  const [color, setColor] = useState('000000');
  const [email, setEmail] = useState('');
  const [houseName, setHouseName] = useState('House Name');
  const [houseId, setHouseId] = useState('House ID');
  const [members, setMembers] = useState({});

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
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
      <View className="pt-10 flex justify-center items-center max-w-lg w-full gap-1">
        <View
          className="ml-1 w-32 h-32 rounded-full self-center flex items-center justify-center"
          style={{ backgroundColor: `#${color}` }}
        >
          <Text className="text-5xl text-white text-center">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-3xl font-bold text-center">{name}</Text>
        <Text className="text-lg text-center text-gray-500 pb-4">{email}</Text>

        <View className="flex-col justify-center items-center w-full mb-32">
          <Text className="w-full text-left px-5 text-lg text-gray-500 font-medium">Houses</Text>
          <HouseInfo name={houseName} houseid={houseId} members={members} />
        </View>

        <Button buttonLabel="Logout" onPress={userSignOut} />
      </View>
    </View>
  );
}