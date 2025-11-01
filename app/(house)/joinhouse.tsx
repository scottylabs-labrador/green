import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { joinHouseWithInvite, listenForHouseInfo } from '@/api/house';
import ColorPicker from '@/components/ColorPicker';
import CustomButton from '@/components/CustomButton';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';

export default function JoinHouse() {
  const router = useRouter();
  const { user } = useAuth();

  const { key } = useLocalSearchParams<{ key: string }>();

  const [color, setColor] = useState('#ca3a31');
  const [houseName, setHouseName] = useState('');
  const [userId, setUserId] = useState('');
  const [groceryListId, setGroceryListId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAddMember, setLoadingAddMember] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (user && user.uid) {
          setUserId(user.uid);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        console.error("Error while fetching user id:", err);
      }
    }

    fetchUserId();
  }, [user]);

  // Get house information using house ID (key)
  useEffect(() => {
    if (!key) return;

    try {
      const unsubscribe = listenForHouseInfo(key, (house) => {
        if (house.name) {
          setHouseName(house.name);
        }
        if (house.grocerylist) {
          setGroceryListId(house.grocerylist);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening for house info:", err);
    }
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
          <CustomButton buttonLabel="Join House" onPress={addMember} isLoading={loadingAddMember}></CustomButton>
        </View>
      </View>
    </View>
  );
}
