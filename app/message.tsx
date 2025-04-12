import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { Link, useLocalSearchParams } from "expo-router"; 
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import MatchedItem from '../components/MatchedItem';
import CustomButton from "../components/CustomButton";
import Feather from '@expo/vector-icons/Feather';
import { calculateSplits } from '../api/splits';

export default function Message() {
    // TODO: Implement the bill page
    // Returns an assignment of receipt items to grocery items,
    // also might have popups to resolve any unknown items.

    const { receiptId } = useLocalSearchParams();
    const [splits, setSplits] = useState({});
    const [message, setMessage] = useState(`Hi friends, I bought this week's groceries! Here is the breakdown:\n`);
    console.log("receiptid: ", receiptId);

    const db = getDatabase();
    

    useEffect(() => {
        const createMessage = (splits) =>{
            let currmessage = `Hi friends, I bought this week's groceries! Here is the breakdown:\n`;
            for (const user in splits){
                currmessage = currmessage + "\n" + user + ": " + splits[user];
            }
            return currmessage;
        }
        const fetchData = () => {
            const receiptItemRef = ref(db, "receipts/"+receiptId+"/receiptitems");
            get(receiptItemRef).then((snapshot) => {
                const data = snapshot.val();
                const svalues = calculateSplits(data);
                setSplits(svalues);
                let msg = createMessage(svalues);
                setMessage(msg);
            });
        }
        fetchData();
    }, [db]);

    async function copyMessage(){
        console.log("Trying to copy Message");
        navigator.clipboard.writeText(message)
        .then(() => {
            console.log('Message copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    return (
        <View className="flex-1 items-center">
        <View className="flex-1 items-center w-full h-full bg-[#6d0846]">
            <View className="mt-8 mb-6 w-fit gap-2 self-center">
                <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
            </View>
            <View className="flex-col items-center justify-center w-full flex-grow mb-20 justify-self-center">
                <View className="flex-col gap-4 w-64 h-fit bg-white rounded-3xl p-6">
                  <Link href="/" asChild>
                      <Pressable 
                          className="absolute w-fit h-fit items-center justify-center right-5 top-4"
                      >
                          <Feather name="x" size={24} color="black" />
                      </Pressable>
                  </Link>
                  <Text className="text-center mt-2">Grocery List</Text>
                  <Text className="">{message}</Text>
                  {/* <Pressable 
                      className="w-fit h-8 items-center justify-center self-center bg-emerald-900 hover:bg-gray-600 py-2.5 px-4 rounded-lg"
                  >
                      <Text className="text-white text-center">Copy Message</Text>
                  </Pressable> */}
                  <CustomButton buttonLabel="Create House" onPress={() => copyMessage()}></CustomButton>
                </View>
            </View>
            <NavBar location="message"/>
        </View>
        </View>
    );
}