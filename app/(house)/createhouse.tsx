import { Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import CustomButton from '../../components/CustomButton';

import React, { useState, useCallback } from 'react';
import { router } from 'expo-router';
import * as crypto from 'crypto';

import '../../main.css';
import { writeHouseData } from '../../api/firebase';
import { writeGroceryList } from '../../api/firebase';

export default function Page() {
  const [name, onChangeName] = useState('');
  const [code, onChangeCode] = useState('');
  const [userid, setUserId] = useState('');
  const [username, setUserName] = useState('');

  async function changetojoin(name) {
    const housecode = window.crypto.randomUUID();
    const grocerylist = window.crypto.randomUUID();
    // const id: {"name":string, "color": string, "userid": string} = {"name": username, "color": "N/A", "userid": userid};
    writeHouseData(name, housecode, grocerylist);
    writeGroceryList(grocerylist, name);
    // window.location.href ='/joinhouse?key='+housecode;
    // Slight problem where user needs to reload themself, needs to be fixed
    router.replace('/joinhouse?key=' + housecode);
  }

  return (
    <View className="padding-24 flex-1 items-center">
      <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left mb-9 text-4xl font-semibold">Create House</Text>
        <Text className="mb-2">House Name</Text>
        <TextInput
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChangeText={onChangeName}
          value={name}
        />
        {/* <TouchableOpacity 
                className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                onPress = {() => changetojoin(name)}
                >
                <Text className="text-white text-center self-center">Create House</Text>
            </TouchableOpacity> */}
        <CustomButton buttonLabel="Create House" onPress={() => changetojoin(name)}></CustomButton>
      </View>
    </View>
  );
}
