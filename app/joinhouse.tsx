
import { Text, View, Button, TextInput, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback , useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { getCurrentUser } from "../api/firebase";
import { router } from "expo-router"

import "../main.css";
import { writeGroceryItem } from "../api/firebase";

export default function Page() {
    // TODO: Implement the list page
    // Display a list of grocery items
    // Allow users to add, remove, and update items
    const [code, onChangeCode] = useState('');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const [housecode, onHouseCodeChange] = useState('');
    const [members, setMembersHouse] = useState([]);
    const [choosencolor, setColor] = useState([]);
    const [name, setNameHouse] = useState([]);
    const [datahousecode, setData] = useState([]);
    const [userid, setuserid] = useState("tempuser");
    const [username, setusername] = useState("username");

    let user;
    useEffect(() => {
        const fetchData = () => {
            console.log("You working?");
            const db = getDatabase();
            const itemRef = ref(db, 'houses/'+housecode);
            console.log(db);
            console.log(itemRef);
            onValue(itemRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data);
                onHouseCodeChange(urlParams.get('key'));
                console.log(data);
                console.log(data);
                setNameHouse(data.name);
                setMembersHouse(data.members);
            });
        }

        fetchData();
        console.log("Loaded");
        user = getCurrentUser();
        console.log(user);
    }, [name]); 

    useEffect(() => {
        // Update the document title using the browser API
        console.log("HERE");
        console.log(choosencolor);
    },[choosencolor]);

    function setcolor(color){
        setColor((prev) => color)
        console.log(choosencolor)
    }

    function addMember(){
        console.log(choosencolor)
        const db = getDatabase();
        const postListRef = ref(db, 'houses/'+housecode+'/members/'+userid);
        set(postListRef, {
            name: username,
            color: choosencolor
        });
        console.log(housecode)
        
        console.log(name)
        console.log(members)
    }

    return (
        <View className="flex-1 items-center padding-24">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
            <Text className="mb-9 text-4xl justify-left text-center font-semibold">{name}</Text>
            <View className="flex-row justify-evenly items-center padding-24">
                <TouchableOpacity 
                    className="w-8 h-8 bg-red-600"
                    onPress = {()=>setcolor("CA3A31")}
                    // red
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-8 h-8 bg-orange-600"
                    onPress = {()=>setcolor("D9622A")}
                    // orange
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-8 h-8 bg-yellow-600"
                    onPress = {()=>setcolor("C18D2F")}
                    // yellow
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-8 h-8 bg-green-600"
                    onPress = {()=>setcolor("4CA154")}
                    // green
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-8 h-8 bg-blue-600"
                    onPress = {()=>setcolor("3662E3")}
                    //blue
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-8 h-8 bg-purple-600"
                    onPress = {()=>setcolor("883AE1")}
                    //purple
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                
            </View>
            <View className="flex-row justify-evenly items-center padding-24">
                <Link href="/joinhousecode" asChild>
                <TouchableOpacity 
                    className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                    >
                    <Text className="text-white text-center self-center">Back</Text>
                </TouchableOpacity>
                </Link>
                <Link href="/list" asChild>
                <TouchableOpacity 
                    className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                    onPress = {()=>addMember()}
                    >
                    <Text className="text-white text-center self-center">Join House</Text>
                </TouchableOpacity>
                </Link>
            </View>
        </View>
        </View>
    );
}
