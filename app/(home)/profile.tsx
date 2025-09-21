import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { onAuthChange } from '../../api/auth';
import { db, getCurrentUser, userSignOut } from '../../api/firebase';
import Button from '../../components/CustomButton';
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

      console.log("house id: ", houseId);
      
      if (!houseId) return;

      setHouseId(houseId);

      const houseSnap = await get(ref(db, `houses/${houseId}`));
      const houseData = houseSnap.val();

      console.log("house data:", houseData);

      if (!houseData) return;

      setHouseName(houseData.name);
      setMembers(houseData.members);

      const userData = houseData.members[filteredEmail];
      if (userData) {
        console.log("user data:", userData);
        setName(userData.name);
        setColor(userData.color);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-start w-full h-full">
      <View className="flex w-full h-full max-w-lg items-center justify-start gap-1 p-6 pt-16">
        <View
          className="ml-1 flex h-32 w-32 items-center justify-center self-center rounded-full"
          style={{ backgroundColor: `#${color}` }}
        >
          <Text className="text-center text-5xl text-white">{name[0]?.toUpperCase()}</Text>
        </View>

        <Text className="pt-2 text-center text-3xl font-bold">{name}</Text>
        <Text className="pb-4 text-center text-lg text-gray-500">{email}</Text>

        <View className="w-full flex-col items-center justify-center">
          <Text className="w-full px-5 text-left text-lg font-medium text-gray-500">Houses</Text>
          <HouseInfo name={houseName} houseid={houseId} members={members} />
        </View>

        <View className="absolute bottom-0">
          <Button buttonLabel="Logout" onPress={userSignOut} />
        </View>
      </View>
    </View>
  );
}
