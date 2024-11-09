import { Text, View, Button, TextInput, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback } from 'react';
import { router } from "expo-router"
import * as crypto from "crypto";

import "../main.css";
import { writeHouseData } from "../api/firebase";

export default function Page() {
    const [name, onChangeName] = useState('');
    const [code, onChangeCode] = useState('');
    const id: [string, string] = ["temp", "FF0000"];

    async function changetojoin(name, id){
        const housecode = window.crypto.randomUUID();
        writeHouseData(name, id, housecode);
        // window.location.href ='/joinhouse?key='+housecode;
        router.replace('/joinhouse?key='+housecode);
    }

    return (
        <View className="flex-1 items-center padding-24">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
            <Text className="mb-9 text-4xl justify-left font-semibold">Create House</Text>
            <Text className="mb-2">House Name</Text>
            <TextInput
                className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
                onChangeText={onChangeName}
                value={name}
            />
            <TouchableOpacity 
                className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                onPress = {() => changetojoin(name, id)}
                >
                <Text className="text-white text-center self-center">Create House</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}