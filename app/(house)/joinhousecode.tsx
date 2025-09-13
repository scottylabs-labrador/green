import { Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import React, { useState, useCallback, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from 'firebase/database';
import { router, useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';

import '../../main.css';
import { writeGroceryItem } from '../../api/firebase';
import { House } from '../../api/classes';

export default function Page() {
  // TODO: Implement the list page
  // Display a list of grocery items
  // Allow users to add, remove, and update items
  const [code, onChangeCode] = useState('');
  const [houses, setHousesItem] = useState([]);
  const db = getDatabase();
  const itemRef = ref(db, 'houses/');

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const itemRef = ref(db, 'houses/');
      get(itemRef).then(snapshot => {
        const data = snapshot.val();
        setHousesItem(data);
      });
    };
    fetchData();
  }, []);

  function redirectToHouse() {
    console.log('Here');
    onValue(itemRef, snapshot => {
      console.log('Problem');
      const data = snapshot.val();
      var keys = Object.keys(data);
      if (keys.includes(code)) {
        window.location.href = '/joinhouse?key=' + code;
        // router.push('/joinhouse?key='+code)
        // return true;
      } else {
        console.log(code);
        window.location.href = '/joinhousecode';
        // router.replace('/joinhousecode')
        // return false;
      }
      console.log('Reached :))))');
    });
  }

  function stuff(code: string) {
    onChangeCode(code);
    console.log(code);
    return false;
  }

  function test() {
    console.log(code);
  }

  return (
    <View className="padding-24 flex-1 items-center">
      <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left mb-9 text-4xl font-semibold">Join a House</Text>
        <Text className="mb-2">Enter Code</Text>
        <TextInput
          className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 align-middle text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          onChangeText={onChangeCode}
          value={code}
        />
        <CustomButton buttonLabel="Join House" onPress={redirectToHouse}></CustomButton>
        {/* <TouchableOpacity 
                className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                onPress = {redirectToHouse}
                >
                <Text className="text-white text-center self-center">Join House</Text>
            </TouchableOpacity> */}
      </View>
    </View>
  );
}
