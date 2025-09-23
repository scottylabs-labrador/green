import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDatabase, onValue, ref, set, update } from 'firebase/database';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { onAuthChange } from '../../api/auth';
import { getCurrentUser } from '../../api/firebase';
import CustomButton from '../../components/CustomButton';

export default function JoinHouse() {
  const { key } = useLocalSearchParams<{ key: string }>();

  const db = getDatabase();
  const [members, setMembersHouse] = useState([]);
  const [chosencolor, setColor] = useState('');
  const [houseName, setHouseName] = useState([]);
  const [userid, setuserid] = useState('tempuser');
  const [username, setusername] = useState('username');
  const [email, setemail] = useState('email');
  const [grocerylistid, setgrocerylistid] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const activeColor = 'outline outline-emerald-900 outline-offset-1';
  const RED = 'CA3A31';
  const ORANGE = 'D9622A';
  const YELLOW = 'C18D2F';
  const GREEN = '4CA154';
  const BLUE = '3662E3';
  const PURPLE = '883AE1';

  useEffect(() => {
    const getuser = onAuthChange(user => {
      if (user) {
        console.log('Here try get user email');
        let email = getCurrentUser()?.email || '';
        console.log('user email: ' + email);
        var emailParts = email.split('.');
        var filteredEmail = emailParts[0] + ':' + emailParts[1];
        console.log('filteredEmail: ' + filteredEmail);
        setemail(filteredEmail);
        setuserid(filteredEmail);
      } else {
        console.log('no user');
        window.location.href = '/login'; // Redirect if not logged in
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
      if (data?.members) {
        setMembersHouse(data.members);
      }
      if (data?.grocerylist) {
        setgrocerylistid(data.grocerylist);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [key]);

  useEffect(() => {
    const fetchData = () => {
      const db = getDatabase();
      const itemRef = ref(db, 'housemates/' + email);
      onValue(itemRef, snapshot => {
        try {
          const data = snapshot.val();
          setusername(data.name);
          setuserid(email);
          console.log(data.name);
          console.log(email);
        } catch {}
      });
    };
    fetchData();
  }, [email]);

  function addMember() {
    const db = getDatabase();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('key');
    const postListRef = ref(db, 'houses/' + code + '/members/' + userid);
    set(postListRef, {
      name: username,
      color: chosencolor,
    });
    const anotherplr = ref(db, 'housemates/' + userid);
    update(anotherplr, {
      houses: [code],
    });
    console.log(code);
    console.log(userid);

    router.push({ pathname: '/list', params: { grocerylist: grocerylistid } });
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Loading house...</Text>
      </View>
    );
  }

  if (!houseName) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No house found for this code.</Text>
      </View>
    );
  }

  return (
    <View className="padding-24 flex-1 items-center">
      <View className="mx-auto mb-20 w-9/12 max-w-6xl flex-1 justify-center">
        <Text className="justify-left mb-9 text-center text-4xl font-semibold">{houseName}</Text>
        <View className="padding-24 mb-6 flex-row items-center justify-evenly">
          <TouchableOpacity
            className={`h-8 w-8 bg-red-600 ${chosencolor == RED ? activeColor : ''}`}
            onPress={() => setColor(RED)}
            // red
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`h-8 w-8 bg-orange-600 ${chosencolor == ORANGE ? activeColor : ''}`}
            onPress={() => setColor(ORANGE)}
            // orange
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`h-8 w-8 bg-yellow-600 ${chosencolor == YELLOW ? activeColor : ''}`}
            onPress={() => setColor(YELLOW)}
            // yellow
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`h-8 w-8 bg-green-600 ${chosencolor == GREEN ? activeColor : ''}`}
            onPress={() => setColor(GREEN)}
            // green
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`h-8 w-8 bg-blue-600 ${chosencolor == BLUE ? activeColor : ''}`}
            onPress={() => setColor(BLUE)}
            //blue
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`h-8 w-8 bg-purple-600 ${chosencolor == PURPLE ? activeColor : ''}`}
            onPress={() => setColor(PURPLE)}
            //purple
          >
            <Text className="self-center text-center text-white"></Text>
          </TouchableOpacity>
        </View>
        <View className="padding-24 flex-row items-center justify-evenly">
          <CustomButton buttonLabel="Back" onPress={() => router.back()} />
          <CustomButton buttonLabel="Join House" onPress={() => addMember()}></CustomButton>
        </View>
      </View>
    </View>
  );
}
