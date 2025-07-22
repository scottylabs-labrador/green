import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { Link, useLocalSearchParams } from "expo-router"; 
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MatchedItem from '../../components/MatchedItem';
import CustomButton from "../../components/CustomButton";
import Feather from '@expo/vector-icons/Feather';
import { calculateSplits } from '../../api/splits';

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
        const createMessage = async () =>{
            let currmessage = `Hi friends, I bought this week's groceries! Here is the breakdown:\n`;
            const receiptItemRef = ref(db, "receipts/"+receiptId+"/receiptitems");
            const housematesRef = ref(db, "housemates");
            get(receiptItemRef).then((snapshot) => {
                const data = snapshot.val();
                const svalues = calculateSplits(data);
                console.log("svalues:", svalues);
                setSplits(svalues);
                return svalues;
            }).then((splits) => {
                return {snapshot: get(housematesRef), splits: splits};
            }).then(async ({snapshot: snapshot, splits: splits}) => {
                const data = (await snapshot).val();
                console.log("data:", data);
                for (const user in splits){
                    console.log("user: ", data[user].name);
                    currmessage = currmessage + "\n" + data[user].name + ": $" + splits[user].toFixed(2);
                }
                setMessage(currmessage);
            });
            
            // const housematesRef = ref(db, "housemates");
            // get(housematesRef).then((snapshot) => {
            //     const data = snapshot.val();
            //     console.log("data:", data);
            //     for (const user in splits){
            //         console.log("user: ", data[user].name);
            //         currmessage = currmessage + "\n" + data[user].name + ": $" + splits[user];
            //     }
            //     setMessage(currmessage);
            // })
            // .then(() => {
            //     const receiptItemRef = ref(db, "receipts/"+receiptId+"/receiptitems");
            //     return get(receiptItemRef) })
            // .then((snapshot) => {
            //     const data = snapshot.val();
            //     const svalues = calculateSplits(data);
            //     console.log("svalues:", svalues);
            //     setSplits(svalues);
            // });
        }

        createMessage();
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
        <View className="flex-1 items-center w-full h-full">
            <View className="mt-8 mb-6 w-fit gap-2 self-center">
                <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
            </View>
            <View className="flex-col items-center justify-center w-full flex-grow mb-20 justify-self-center">
                <View className="flex-col gap-4 w-64 h-fit bg-white rounded-3xl p-6">
                  <Link href={{pathname: "/bill", params: { receiptId: receiptId }}} asChild>
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
                  <Pressable className="bg-emerald-900 rounded-lg py-3 px-6 self-center hover:bg-[#3e5636]" onPress={copyMessage}>
                       <Text className="text-white text-sm font-semibold">Copy Message</Text>
                  </Pressable>
                  {/* <CustomButton buttonLabel="Create House" onPress={() => copyMessage()}></CustomButton> */}
                </View>
            </View>
        </View>
        </View>
    );
}