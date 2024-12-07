import { Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

import React, { useState, useCallback , useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { router } from "expo-router"


import "../main.css";
import { writeGroceryItem } from "../api/firebase";
import { House } from "../api/classes";

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
            get(itemRef).then((snapshot) => {
                const data = snapshot.val();
                setHousesItem(data);
            });
        }
        fetchData();
    }, []);

    function redirectToHouse(){
        console.log("Here")
        onValue(itemRef, (snapshot) => {
            console.log("Problem")
            const data = snapshot.val();
            var keys = Object.keys(data);
            if (keys.includes(code)){
                window.location.href ='/joinhouse?key='+code
                // router.push('/joinhouse?key='+code)
                // return true;
            }
            else{
                console.log(code);
                window.location.href = '/joinhousecode'
                // router.replace('/joinhousecode')
                // return false;
            }
            console.log("Reached :))))")
        });
    }

    function stuff(code: string){
        onChangeCode(code);
        console.log(code);
        return false;
    }

    function test(){
        console.log(code);
    }


    return (
        <View className="flex-1 items-center padding-24">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
            <Text className="mb-9 text-4xl justify-left font-semibold">Join a House</Text>
            <Text className="mb-2">Enter Code</Text>
            <TextInput
                className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
                onChangeText={onChangeCode}
                value={code}
            />
            <TouchableOpacity 
                className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                onPress = {() => redirectToHouse()}
                >
                <Text className="text-white text-center self-center">Join House</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}
