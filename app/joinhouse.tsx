
import { Text, View, TextInput, TouchableOpacity} from "react-native";
import { Link } from "expo-router";
import React, { useState, useCallback , useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get, update } from "firebase/database";
import { getCurrentUser } from "../api/firebase";
import { router, useRouter } from "expo-router"

import "../main.css";
import { writeGroceryItem } from "../api/firebase";
import CustomButton from "../components/CustomButton";
import LinkButton from "../components/LinkButton";
import { onAuthChange } from "../api/auth";

export default function Page() {
    // TODO: Implement the list page
    // Display a list of grocery items
    // Allow users to add, remove, and update items
    const db = getDatabase();
    const [code, onChangeCode] = useState('');
    const [housecode, onHouseCodeChange] = useState('');
    const [members, setMembersHouse] = useState([]);
    const [chosencolor, setColor] = useState("");
    const [name, setNameHouse] = useState([]);
    const [datahousecode, setData] = useState([]);
    const [userid, setuserid] = useState("tempuser");
    const [username, setusername] = useState("username");
    const [email, setemail] = useState("email");
    const [grocerylistid, setgrocerylistid] = useState("");
    const router = useRouter();

    const activeColor = 'outline outline-emerald-900 outline-offset-1';
    const RED = 'CA3A31';
    const ORANGE = 'D9622A';
    const YELLOW = 'C18D2F';
    const GREEN = '4CA154';
    const BLUE = '3662E3';
    const PURPLE = '883AE1';

    let user;
    useEffect(() => {
        const getuser = onAuthChange((user) => {
            if (user) {
                console.log("Here try get user email");
                let email = getCurrentUser().email;
                console.log("user email: " + email);
                var emailParts = email.split(".");
                var filteredEmail = emailParts[0]+":"+emailParts[1];
                console.log("filteredEmail: " + filteredEmail);
                setemail(filteredEmail);
                setuserid(filteredEmail);
            } else {
                console.log("no user");
                window.location.href = "/login"; // Redirect if not logged in
            }
        }
        );

        return () => getuser();
    }, []);

    useEffect(() => {
        const fetchData = () => {
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
                    console.log(data.name);
                    console.log(email);
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
            color: chosencolor
        });
        const anotherplr = ref(db, 'housemates/'+userid);
        update(anotherplr, {
            houses:[code]
        });
        console.log(code);
        console.log(userid);

        router.push(
            {pathname: '/list', 
            params: { grocerylist: grocerylistid }
            });
    }

    return (
        <View className="flex-1 items-center padding-24">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mb-20">
            <Text className="mb-9 text-4xl justify-left text-center font-semibold">{name}</Text>
            <View className="flex-row justify-evenly items-center padding-24 mb-6">
                <TouchableOpacity 
                    className={`w-8 h-8 bg-red-600 ${chosencolor==RED ? activeColor : ''}`}
                    onPress = {()=>setColor(RED)}
                    // red
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`w-8 h-8 bg-orange-600 ${chosencolor==ORANGE ? activeColor : ''}`}
                    onPress = {()=>setColor(ORANGE)}
                    // orange
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`w-8 h-8 bg-yellow-600 ${chosencolor==YELLOW ? activeColor : ''}`}
                    onPress = {()=>setColor(YELLOW)}
                    // yellow
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`w-8 h-8 bg-green-600 ${chosencolor==GREEN ? activeColor : ''}`}
                    onPress = {()=>setColor(GREEN)}
                    // green
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`w-8 h-8 bg-blue-600 ${chosencolor==BLUE ? activeColor : ''}`}
                    onPress = {()=>setColor(BLUE)}
                    //blue
                    >
                    <Text className="text-white text-center self-center"></Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`w-8 h-8 bg-purple-600 ${chosencolor==PURPLE ? activeColor : ''}`}
                    onPress = {()=>setColor(PURPLE)}
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
