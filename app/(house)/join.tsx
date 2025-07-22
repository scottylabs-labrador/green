import { getGroceryListIdFromHouse } from 'api/grocerylist';
import { getHouseFromInvite, getHouseNameFromId, joinHouseWithInvite } from 'api/join';
import CustomButton from 'components/CustomButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function JoinPage() {
  const { invite } = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState('');
  const [houseId, setHouseId] = useState('');
  const [color, setColor] = useState('');
  const [houseName, setHouseName] = useState('');

  const router = useRouter();

  const activeColor = 'outline outline-emerald-900 outline-offset-1';
  const RED = 'CA3A31';
  const ORANGE = 'D9622A';
  const YELLOW = 'C18D2F';
  const GREEN = '4CA154';
  const BLUE = '3662E3';
  const PURPLE = '883AE1';

  useEffect(() => {
    const doJoin = async () => {
      try {
        const userId = getAuth().currentUser?.uid;
        if (!invite || !userId) throw new Error('Missing invite or user');

        setUserId(userId);
        const houseId = await getHouseFromInvite(invite.toString(), userId);
        setHouseId(houseId);
        const houseName = await getHouseNameFromId(houseId);
        setHouseName(houseName);
        setStatus('success');
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Join failed');
        setStatus('error');
      }
    };

    doJoin();
  }, [invite]);

  async function addMember() {
    if (color.length == 0) {
      return;
    }
    await joinHouseWithInvite(houseId, userId, color);
    const groceryListId = await getGroceryListIdFromHouse(houseId);
    router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
}

  if (status === 'loading') {
    return (
      <View className="flex items-center justify-center w-full h-full">
        <Text className="text-soft-green font-semibold text-xl m-3">Joining group...</Text>
        <ActivityIndicator color="#84a787"/>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="flex items-center justify-center w-full h-full">
        <Text className="text-magenta font-semibold m-3">Error joining group: {errorMsg}</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View className="padding-24 flex-1 items-center">
        <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
          <Text className="justify-left mb-9 text-center text-4xl font-semibold">{houseName}</Text>
          <View className="padding-24 mb-6 flex-row items-center justify-evenly">
            <TouchableOpacity
              className={`h-8 w-8 bg-red-600 ${color == RED ? activeColor : ''}`}
              onPress={() => setColor(RED)}
              // red
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 w-8 bg-orange-600 ${color == ORANGE ? activeColor : ''}`}
              onPress={() => setColor(ORANGE)}
              // orange
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 w-8 bg-yellow-600 ${color == YELLOW ? activeColor : ''}`}
              onPress={() => setColor(YELLOW)}
              // yellow
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 w-8 bg-green-600 ${color == GREEN ? activeColor : ''}`}
              onPress={() => setColor(GREEN)}
              // green
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 w-8 bg-blue-600 ${color == BLUE ? activeColor : ''}`}
              onPress={() => setColor(BLUE)}
              //blue
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 w-8 bg-purple-600 ${color == PURPLE ? activeColor : ''}`}
              onPress={() => setColor(PURPLE)}
              //purple
            >
              <Text className="self-center text-center text-white"></Text>
            </TouchableOpacity>
          </View>
          <View className="padding-24 flex-row items-center justify-evenly">
            {/* <Link href="/joinhousecode" asChild>
                  <TouchableOpacity 
                      className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                      >
                      <Text className="text-white text-center self-center">Back</Text>
                  </TouchableOpacity>
                  </Link> */}
            {/* <LinkButton buttonLabel="Back" page="/joinhousecode" /> */}
            {/* <TouchableOpacity 
                      className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                      onPress = {()=>addMember()}
                      >
                      <Text className="text-white text-center self-center">Join House</Text>
  
                  </TouchableOpacity> */}
            <CustomButton buttonLabel="Join House" onPress={addMember}></CustomButton>
          </View>
        </View>
      </View>
    );
  }

  return null;
}
