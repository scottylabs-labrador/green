import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput} from 'react-native';
import React, { useState, useEffect} from 'react';
import { getDatabase, ref, set, push, onValue, get, remove} from "firebase/database";
import NavBar from '../components/NavBar';
import Button from '../components/CustomButton';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getCurrentUser, userSignOut } from "../api/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { onAuthChange } from '../api/auth';
import HouseInfo from '../components/HouseInfo';

export default function Profile() {
  // TODO: Home page
  // Should this exist for users who

    const [name, setName] = useState("Name");
    const [color, setColor] = useState("000000");
    const [grocerylist, onChangeList] = useState("");
    const [actualemail, setactualemail] = useState("email");
    const [email, setemail] = useState("email");
    const [housename, sethousename] = useState("House Name");
    const [houseid, sethouseid] = useState("House id");
    const [members, setmembers] = useState({});
    const db = getDatabase();
    const [gottenuser, setusergotten] = useState(0);
  
      // onAuthChange((user) => {
      //     // setusergotten(gottenuser + 1);
      // });
  
    useEffect(() => {
        const colorsget = onAuthChange((user) => {
            if (user) {
                console.log("Here try get user email");
                let email = getCurrentUser().email;
                setactualemail(email);
                console.log("user email: " + email);
                var emailParts = email.split(".");
                var filteredEmail = emailParts[0]+":"+emailParts[1];
                console.log("filteredEmail: " + filteredEmail);
                setemail(filteredEmail);
                try {
                const itemRef = ref(db, 'housemates/' + filteredEmail);
                var houses;
                onValue(itemRef, (snapshot) => {
                    try {
                        const data = snapshot.val();
                        houses = (data.houses[0]).toString();
                        console.log("houses: " + houses);
                        sethouseid(houses);
                    }
                    catch {
                        console.log("failed to get houses");
                    }
                });
                const houseRef = ref(db, 'houses/' + houses);
                onValue(houseRef, (snapshot) => {
                    try {
                        const data = snapshot.val();
                        console.log("data: " + data);
                        var members = data.members;
                        var housename = data.name;
                        console.log("members: ");
                        console.log(members);
                        console.log(housename);
                        setName(members[filteredEmail]["name"]);
                        setColor(members[filteredEmail]["color"]);
                        sethousename(housename);
                        setmembers(members);
                    }
                    catch {
                        console.log("failed to get info from houses");
                        setusergotten(gottenuser + 1);
                    }
                });
                }
                catch {
                    console.log("failed to get user");
                    setusergotten(gottenuser + 1);
                }
            } else {
                console.log("no user");
                window.location.href = "/login"; // Redirect if not logged in
            }
        }
        );

        return () => colorsget();
    }, [gottenuser]);

  return (
    <View className="flex-1 items-center justify-start p-6">
      <View className="pt-10 flex justify-center items-center max-w-lg w-full gap-1">
        <div className="ml-1 w-32 h-32 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ color}}>
            <Text className="flex-1 text-5xl text-left w-1/2 self-center text-center text-white">{name[0].toUpperCase()}</Text>
        </div>
        <Text className="pt-2 text-3xl font-bold text-center">{name}</Text>
        <Text className="text-lg text-center text-gray-500 pb-4">{actualemail}</Text>
        <View className="flex-col justify-center items-center w-full mb-32">
          <Text className="w-full text-left px-5 text-lg text-gray-500 font-medium mb-0">Houses</Text>
          <HouseInfo
            name={housename}
            houseid={houseid}
            members={members}
          />
        </View>
        <Button buttonLabel="Logout" onPress={userSignOut}></Button>
        <NavBar location="profile" />
      </View>
    </View>
    
  );
}
