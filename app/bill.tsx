import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { Link } from "expo-router"; 
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import ReceiptItem from '../components/ReceiptItem';
import { useLocalSearchParams } from "expo-router"; 

export default function Bill() {
    // TODO: Implement the bill page
    // Returns an assignment of receipt items to grocery items,
    // also might have popups to resolve any unknown items.
    const { receiptId } = useLocalSearchParams();
    console.log("receiptid: ", receiptId);

    const [matchedItems, setMatchedItems] = useState({});
    const [unmatchedItems, setUnmatchedItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    // const [receiptId, setReceiptId] = useState('');
    const [item, onChangeItem] = useState('');
    const db = getDatabase();
    

    useEffect(() => {
        const fetchData = () => {
            const receiptItemRef = ref(db, "receipts/"+receiptId+"/receiptitems");
            get(receiptItemRef).then((snapshot) => {
                const data = snapshot.val();
                let unmatched = {};
                let matched = {};
                for (const key of Object.keys(data)) {
                    console.log("item: ", data[key].groceryItem, typeof data[key].groceryItem);
                    if (data[key].groceryItem.length == 0) {
                        unmatched[key] = data[key];
                        // setUnmatchedItems([...unmatchedItems, data[i]]);
                        console.log("unmatched: ", data[key], unmatched);
                    }
                    else {
                        matched[key] = data[key];
                        // setMatchedItems([...matchedItems, data[i]]);
                        console.log("matched: ", data[key]);
                    }
                }
                setUnmatchedItems(unmatched);
                setMatchedItems(matched);
                console.log("receipt items: ", data);
                // setMatchedItems(data);
            });
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


    return (
        <View className="flex-1 items-center">
        <View className="flex-1 w-full h-full bg-[#6d0846]">
            <View className="mt-14 mb-6 w-fit gap-2 self-center">
                <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
                <Text className="text-4xl text-center text-white font-medium">Here's what we got.</Text>
                <View className="flex-row mt-1 w-[85%] self-center">
                    <Text className="text-1xl text-left grow text-white font-light">Cross-referenced with list 4.23.24</Text>
                    <Text className="text-1xl text-right text-white font-light">Change</Text>
                </View>
            </View>
            <View className="flex gap-4 w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] px-4 pt-6 pb-24 overflow-hidden ">
                {Object.keys(unmatchedItems).length > 0 ? (
                    <View className="h-1/2">
                        <Text className="text-1xl text-left font-medium text-black w-1/2 mx-4 mb-4">Unmatched Items:</Text>
                        <FlatList 
                            className="h-full"
                            data={Object.keys(unmatchedItems)}
                            renderItem={renderUnmatchedItem}
                            keyExtractor={item => item}
                    />
                    </View>
                ) : (
                    <View></View>
                )}
                <View className="h-1/2">
                    <Text className="text-1xl text-left font-medium text-black w-1/2 mx-4 mb-4">Matched Items:</Text>
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
            </View>
            <NavBar />
        </View>
        </View>
    );
}