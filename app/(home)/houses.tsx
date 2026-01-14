import React, { useEffect, useState } from 'react';

import { Link, useRouter } from 'expo-router';
import { FlatList, ListRenderItemInfo, Pressable, Text, View } from 'react-native';

import { getHouseIds, getHouseNameFromId } from '@/api/house';
import { useAuth } from '@/context/AuthContext';
import { useHouseInfo } from '@/context/HouseContext';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Houses() {
  const router = useRouter();
  const { user } = useAuth();
  const { setHouseId } = useHouseInfo();

  const [houseIds, setHouseIds] = useState<string[]>([]);
  const [houseNames, setHouseNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHouseIds = async () => {
      try {
        if (user && user.uid) {
          const ids = await getHouseIds(user.uid);
          setHouseIds(ids);
        } else {
          router.replace('/login');
        }
      } catch {
        console.error("Error while fetching house IDs");
      }
    }

    fetchHouseIds();
  }, [user]);

  useEffect(() => {
  const fetchHouseNames = async () => {
    const missingIds = houseIds.filter(id => !houseNames[id]);
    if (missingIds.length === 0) return;

    const entries = await Promise.all(
      missingIds.map(async (id) => [id, await getHouseNameFromId(id)] as const)
    );

    setHouseNames(prev => ({
      ...prev,
      ...Object.fromEntries(entries),
    }));
  };

  fetchHouseNames();
}, [houseIds]);

  const renderHouse = ({ item }: ListRenderItemInfo<string>) => {
    const switchHouse = () => {
      setHouseId(item);
      router.push('/list');
    }

    return (
      <Pressable onPress={switchHouse}>
        <View className="h-12 w-full flex-row items-center justify-center self-center rounded-lg border border-gray-300 px-2">
          <Text className="flex-1 self-center text-left">{houseNames[item] ?? 'Loading...'}</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="gray" />
        </View>
      </Pressable>
    );
  }

  const AddHouse = () => {
    return (
      <Link
        href={'/choosehouse'}
        className="flex h-12 w-full items-center justify-center self-center rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100"
      >
        <View className="w-full flex-row items-center justify-center gap-3 px-2">
          <Text className="text-1xl grow text-left text-gray-500">New House</Text>
          <Ionicons name="add" size={24} color="lightgray" />
        </View>
      </Link>
    );
  }

  return (
    <View className="h-full w-full flex-1 items-center justify-start overflow-y-auto">
      <View className="flex h-full w-full max-w-lg items-center justify-start gap-1 pb-6 pt-16 px-8">
        <Text className="text-center text-lg font-medium">Houses</Text>
        <View className="w-full mt-5">
          <FlatList
            className="h-full"
            data={houseIds}
            renderItem={renderHouse}
            keyExtractor={item => item}
            contentContainerStyle={{ gap: 8 }}
            ListFooterComponent={<AddHouse />}
          />
        </View>
      </View>
    </View>
  );
} 