import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { getCurrentUser } from "../../api/firebase";
import NavBar from '../../components/NavBar';
import ReceiptItem from '../../components/ReceiptItem';
import { useLocalSearchParams, useRouter, Link } from "expo-router"; 
import LinkButton from "../../components/LinkButton";
import CustomButton from '../../components/CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Bill() {
    // TODO: Implement the bill page
    // Returns an assignment of receipt items to grocery items,
    // also might have popups to resolve any unknown items.
    const { receiptId } = useLocalSearchParams();

    const [matchedItems, setMatchedItems] = useState({});
    const [unmatchedItems, setUnmatchedItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [createDate, setCreateDate] = useState('');
    const [colors, setColors] = useState({});
    const db = getDatabase();
    const router = useRouter();

    useEffect(() => {
        const fetchData = () => {
            const receiptRef = ref(db, "receipts/"+receiptId);
            get(receiptRef).then((snapshot) => {
                const data = snapshot.val();
                let unmatched = {};
                let matched = {};
                if (data && data.receiptitems) {
                    if (data.receiptitems) {
                        const receiptItems = data.receiptitems;
                        for (const key of Object.keys(receiptItems)) {
                            if (receiptItems[key].groceryItem.length == 0) {
                                unmatched[key] = receiptItems[key];
                            }
                            else {
                                matched[key] = receiptItems[key];
                            }
                        }
                        setUnmatchedItems(unmatched);
                        setMatchedItems(matched);
                    }
                    if (data.date) {
                        let date = data.date;
                        let parts = date.split('/');
                        let year = parts[2].slice(-2);
                        date = `${parts[0]}.${parts[1]}.${year}`;
                        setCreateDate(date);
                    }
                    else {
                        const currentDate = new Date();
                        let date = currentDate.toLocaleDateString();
                        let parts = date.split('/');
                        let year = parts[2].slice(-2);
                        date = `${parts[0]}.${parts[1]}.${year}`;
                        setCreateDate(date);
                    }   
                }
            });

            let email = getCurrentUser()?.email;
            var emailParts = email.split(".");
            var filteredEmail = emailParts[0]+":"+emailParts[1];
            try {
                const itemRef = ref(db, 'housemates/' + filteredEmail);
                var houses;
                onValue(itemRef, (snapshot) => {
                try {
                    const data = snapshot.val();
                    houses = (data.houses[0]).toString();
                }
                catch {
                    console.error("failed to get houses");
                }
                });
                const houseRef = ref(db, 'houses/' + houses);
                onValue(houseRef, (snapshot) => {
                try {
                    const data = snapshot.val();
                    var members = data.members;
                    setColors(members);
                }
                catch {
                    console.error("failed to get members from house");
                }
                });
            }
            catch {
                console.error("failed to get user");
            }
        }
        fetchData();
    }, [db]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    const renderMatchedItem = ({ item }) => {
        return (
            <ReceiptItem
                key={item}
                id={item}
                name={matchedItems[item].groceryItem}
                // quantity={matchedItems[item].quantity}
                price={matchedItems[item].price}
                splits={matchedItems[item].splits}
                colors={colors}
                matched={true}
                receiptId={receiptId}
            />
        );
    }
    const renderUnmatchedItem = ({ item }) => {
        return (
            <ReceiptItem
                key={item}
                id={item}
                name={unmatchedItems[item].receiptItem}
                // quantity={matchedItems[item].quantity}
                price={unmatchedItems[item].price}
                matched={false}
                receiptId={receiptId}
            />
        );
    }

    const AddItem = () => {
        return (
            <Link href={{
                pathname: '/unmatched/', 
                params: { itemId: null, receiptId: receiptId },
                }}
                className="flex-row items-center justify-center w-[85%] h-12 self-center border border-gray-300 rounded-lg">
                <View className="flex-row items-center justify-center gap-3 w-full pr-2">
                    <Text className="text-1xl grow text-left self-center text-gray-500">Add Item</Text>
                    <Ionicons name="add" size={24} color="lightgray"/>
                </View>
            </Link>
        )
    }

    return (
        <View className="flex-1 items-center">
            <View className="flex-1 w-full h-full">
                <View className="flex flex-col justify-center items-center mt-16 mb-8 h-16">
                    <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
                    <Text className="text-4xl text-center text-white font-medium">Here's what we got.</Text>
                    <View className="flex-row mt-1 w-[85%] self-center">
                        <Text className="text-1xl text-left grow text-white font-light">Cross-referenced with list {createDate}</Text>
                        <Text className="text-1xl text-right text-white font-light">Change</Text>
                    </View>
                </View>
                <View className="w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] pt-6 overflow-hidden">
                    {Object.keys(unmatchedItems).length > 0 ? (
                        <View className="max-h-[50%] mb-4">
                            <Text className="text-1xl text-left font-medium text-black mb-4 px-6">Unmatched Items:</Text>
                            <FlatList 
                                data={Object.keys(unmatchedItems)}
                                renderItem={renderUnmatchedItem}
                                keyExtractor={item => item}
                                contentContainerStyle={{ gap: 8 }}
                                style={{ flexGrow: 0 }}
                        />
                        </View>
                    ) : (
                        <View></View>
                    )}
                    <View className="flex-1">
                        <Text className="text-1xl text-left font-medium text-black mb-4 px-6">Matched Items:</Text>
                        <FlatList 
                            className="h-full"
                            data={Object.keys(matchedItems)}
                            renderItem={renderMatchedItem}
                            keyExtractor={item => item}
                            ListFooterComponent={<AddItem />}
                            contentContainerStyle={{ gap: 8 }}
                        />
                    </View>
                    {Object.keys(unmatchedItems).length == 0 ? (
                        <View className="bg-white">
                            <Pressable className="bg-magenta rounded-lg py-3 px-6 self-center hover:bg-dark-magenta">
                                <Link href={{pathname: "/message", 
                                    params: { receiptId: receiptId }}} className="flex items-center justify-center">
                                <Text className="text-white text-sm font-semibold">Generate Totals</Text>
                                </Link>
                            </Pressable>
                        </View>
                    ) : (
                        <View></View>
                    )}
                </View>
            </View>
        </View>
    );
}



