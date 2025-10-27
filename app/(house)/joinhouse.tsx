import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Text, View } from 'react-native';

import { getCurrentUser, getUserIdFromEmail, onAuthChange } from '../../api/auth';
import { joinHouseWithInvite } from '../../api/house';
import ColorPicker from '../../components/ColorPicker';
import CustomButton from '../../components/CustomButton';
import Loading from '../../components/Loading';

export default function JoinHouse() {
  const { key } = useLocalSearchParams<{ key: string }>();

  const db = getDatabase();
  const [color, setColor] = useState('#ca3a31');
  const [houseName, setHouseName] = useState('');
  const [userId, setUserId] = useState('');
  const [groceryListId, setGroceryListId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAddMember, setLoadingAddMember] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getuser = onAuthChange(user => {
      if (user) {
        let email = getCurrentUser()?.email || '';
        let userId = getUserIdFromEmail(email);
        setUserId(userId);
      } else {
        console.log('no user');
        router.replace('/login'); // Redirect if not logged in
      }
    });

    return () => getuser();
  }, []);

  // Get house information using house ID (key)
  useEffect(() => {
    if (!key) return;

    const houseRef = ref(db, 'houses/' + key);
    const unsubscribe = onValue(houseRef, snapshot => {
      const data = snapshot.val();
      if (data?.name) {
        setHouseName(data.name);
      }
      if (data?.grocerylist) {
        setGroceryListId(data.grocerylist);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [key]);

  async function addMember() {
    try {
      setLoadingAddMember(true);
      await joinHouseWithInvite(key, userId, color);
      router.push({ pathname: '/list', params: { grocerylist: groceryListId } });
    } catch (err) {
      setLoadingAddMember(false);
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error("Error while joining house: ", err);
    }
  }

  if (loading) {
    return (
      <Loading message="Loading house..." />
    );
  }

  if (loadingAddMember) {
    return (
      <Loading message="Joining house..." />
    );
  }

  if (!houseName) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No house found for this code.</Text>
        <CustomButton buttonLabel="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center">
      <View className="mx-auto w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left text-center text-2xl font-semibold">Welcome to</Text>
        <Text className="justify-left text-center text-4xl font-semibold mb-4">{houseName}</Text>
        <Text className="justify-left mb-4 text-center">Claim a color:</Text>
        <ColorPicker color={color} onColorPick={setColor} />
        {error && 
          <Text className="text-red-500 mt-4">
            Error: {error}
          </Text>
        }
        <View className="flex-row items-center justify-evenly mt-5 w-fit self-center gap-4">
          <CustomButton buttonLabel="Back" onPress={() => router.back()} />
          <CustomButton buttonLabel="Join House" onPress={addMember}></CustomButton>
        </View>
      </View>
    </View>
  );
}
