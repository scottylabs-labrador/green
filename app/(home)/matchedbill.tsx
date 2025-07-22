import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { Link } from "expo-router"; 
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import NavBar from '../../components/NavBar';
import MatchedItem from '../../components/MatchedItem';
import CustomButton from "../../components/CustomButton";

export default function MatchedBill() {
    // TODO: Implement the bill page
    // Returns an assignment of receipt items to grocery items,
    // also might have popups to resolve any unknown items.

    const [matchedItems, setMatchedItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [receiptId, setReceiptId] = useState('');
    const [item, onChangeItem] = useState('');
    const db = getDatabase();

    useEffect(() => {
        const fetchData = () => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const receiptId = urlParams.get('grocerylist');
            setReceiptId(receiptId);
            const matchedItemRef = ref(db, "grocerylists/"+receiptId+"/groceryitems");
            const unmatchedItemRef = ref(db, "grocerylists/"+receiptId+"/groceryitems");
            get(matchedItemRef).then((snapshot) => {
                const data = snapshot.val();
                setMatchedItems(data);
            });
        }
        fetchData();
    }, [db]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    const renderMatchedItem = ({ item }) => {
        return (
            <MatchedItem
                key={item}
                id={item}
                name={matchedItems[item].name}
                // quantity={matchedItems[item].quantity}
                price={matchedItems[item].quantity}
                receiptId={receiptId}
            />
        );
    }


    return (
        <View className="flex-1 items-center">
        <View className="flex-1 w-full h-full bg-[#6d0846]">
            <View className="mt-14 mb-6 w-fit gap-2 self-center">
                <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
                <Text className="text-4xl text-center text-white font-medium">List 423 Matched</Text>
                <View className="flex-row mt-1 w-[90%] self-center">
                    <Text className="text-1xl text-left grow text-white font-light">Cross-referenced with list 4.23.24</Text>
                    <Text className="text-1xl text-right text-white font-light">Change</Text>
                </View>
            </View>
            <View className="flex gap-4 w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] rounded-b-3xl px-4 pt-6 pb-24 overflow-hidden mb-24">
                <View className="flex-grow">
                    {Object.keys(matchedItems).length > 0 ? (
                        <FlatList 
                            className="h-full"
                            data={Object.keys(matchedItems)}
                            renderItem={renderMatchedItem}
                            keyExtractor={item => item}
                        />
                    ) : (
                        <View>
                            <Text className="text-3xl font-semibold text-center">Your list is empty!</Text>
                        </View>
                    )}
                </View>
                <View className="h-20 absolute bottom-0 left-0 w-full px-4 py-2">
                  <View className="flex-col ab">
                    <Text className="font-semibold">Sort by:</Text>
                  </View>
                  <Pressable 
                      className="w-fit h-8 items-center justify-center self-end bg-emerald-900 hover:bg-gray-600 py-2.5 px-4 rounded-lg"
                  >
                      <Text className="text-white text-center self-center">Generate Totals</Text>
                  </Pressable>
                </View>
            </View>
        </View>
        </View>
    );
}