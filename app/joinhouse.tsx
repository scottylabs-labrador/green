
import { Text, View, TextInput, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback , useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get, update } from "firebase/database";
import { getCurrentUser } from "../api/firebase";
import { router } from "expo-router"

import "../main.css";
import { writeGroceryItem } from "../api/firebase";
import CustomButton from "../components/CustomButton";
import LinkButton from "../components/LinkButton";

export default function Page() {
    // TODO: Implement the list page
    // Display a list of grocery items
    // Allow users to add, remove, and update items
    const [code, onChangeCode] = useState('');
    const [housecode, onHouseCodeChange] = useState('');
    const [members, setMembersHouse] = useState([]);
    const [choosencolor, setColor] = useState([]);
    const [name, setNameHouse] = useState([]);
    const [datahousecode, setData] = useState([]);
    const [userid, setuserid] = useState("tempuser");
    const [username, setusername] = useState("username");
    const [email, setemail] = useState("email");
    const [grocerylistid, setgrocerylistid] = useState("");

    let user;
    useEffect(() => {
        const fetchData = () => {
            const db = getDatabase();
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const code = urlParams.get('key');
            if (code){
                const itemRef = ref(db, 'houses/'+code);
                onValue(itemRef, (snapshot) => {
                    try{
                        const data = snapshot.val();
                        if(data){
                            setNameHouse(data.name);
                            setMembersHouse(data.members);
                            setgrocerylistid(data.grocerylist);
                        }
                    }
                    catch{}
                });
            } 
        }

        fetchData();
        user = getCurrentUser();
        try{
            var emailparts = user.email.split(".")
            var filteredemail = emailparts[0]+":"+emailparts[1]
            setemail(filteredemail);
        }
        catch{

        }
    }, [housecode]); 

    // Scuffed
    useEffect(() => {
        console.log("reached")
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        onHouseCodeChange(urlParams.get('key'));
    }, []); 

    useEffect(() => {
        const fetchData = () => {
            const db = getDatabase();
            const itemRef = ref(db, 'housemates/'+email);
            onValue(itemRef, (snapshot) => {
                try{
                    const data = snapshot.val();
                    setusername(data.name);
                    setuserid(email);
                }
                catch{}
            });
        }
        fetchData();
    },[email]);

    function setcolor(color){
        setColor((prev) => color)
    }

    function addMember(){
        const db = getDatabase();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('key');
        const postListRef = ref(db, 'houses/'+code+'/members/'+userid);
        set(postListRef, {
            name: username,
            color: choosencolor
        });
        const anotherplr = ref(db, 'housemates/'+userid);
        update(anotherplr, {
            houses:[code]
        });

        window.location.href ='/list?grocerylist='+grocerylistid;
    }

    return (
        <View className="flex-1 items-center padding-24">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
            <Text className="mb-9 text-4xl justify-left text-center font-semibold">{name}</Text>
            <View className="flex-row justify-evenly items-center padding-24 mb-6">
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
                {/* <Link href="/joinhousecode" asChild>
                <TouchableOpacity 
                    className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                    >
                    <Text className="text-white text-center self-center">Back</Text>
                </TouchableOpacity>
                </Link> */}
                <LinkButton buttonLabel="Back" page="/joinhousecode" />
                {/* <TouchableOpacity 
                    className="bg-gray-500 hover:bg-gray-600 mt-10 py-2.5 px-4 w-fit self-center rounded-lg"
                    onPress = {()=>addMember()}
                    >
                    <Text className="text-white text-center self-center">Join House</Text>

                </TouchableOpacity> */}
                <CustomButton buttonLabel="Join House" onPress={() => addMember()}></CustomButton>
            </View>
        </View>
        </View>
    );
}
