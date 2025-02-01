import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput} from 'react-native';
import React, { useState, useEffect} from 'react';
import { getDatabase, ref, set, push, onValue, get, remove} from "firebase/database";
import { removeGroceryItem, writeGroceryItem, updateGroceryItem, writeGroceryItemGrocerylist } from "../api/firebase";
import { Link } from "expo-router"; 
import NavBar from '../components/NavBar';
import GroceryItem from '../components/GroceryItem';
import Button from '../components/CustomButton';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getCurrentUser } from "../api/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function List() {
    // TODO: Implement the list page
    // Display a list of grocery items
    // Allow users to add, remove, and update items

    const [groceryItems, setGroceryItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [item, setItem] = useState('');
    const [grocerylist, onChangeList] = useState("");
    const [email, setemail] = useState("email");
    const db = getDatabase();

    useFocusEffect(()=>{
        var user = getCurrentUser();
        try{
            var emailparts = user.email.split(".")
            var filteredemail = emailparts[0]+":"+emailparts[1]
            setemail(filteredemail);
            console.log(filteredemail);
        }
        catch{
            console.log(user);

        }
    });

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const grocerylistid = urlParams.get('grocerylist');
        onChangeList(grocerylistid);
        const itemRef = ref(db, "grocerylists/"+grocerylistid+"/groceryitems");
        const fetchData = onValue(itemRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGroceryItems(data);
            }
        });
        return () => fetchData();

    }, [db]);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const renderItem = ({ item }) => {
        return (
            <GroceryItem
                key={item}
                grocerylist={grocerylist}
                id={item}
                name={groceryItems[item].name}
                quantity={groceryItems[item].quantity}
                splits = {groceryItems[item].splits}
                member = {email}
            />
        );
    }

    const writeItem = () => {
        console.log("Write " +email);
        writeGroceryItemGrocerylist(grocerylist, item, email);
        setItem('');
        toggleModal();
    }

    const handleWriteItem = (e) => {
        const key = e.nativeEvent.key;
        if (key === "Enter") {
            writeItem();
        }
    }


    return (
        <View className="flex-1 items-center">
        <View className="flex-1 w-full h-full bg-[#3e5636]">
            <View className="my-16 h-fit">
                <Text className="text-1xl text-center text-white">Home</Text>
                <Text className="text-4xl text-center text-white">This week's list</Text>
            </View>
            <View className="w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] pt-6 pb-32 overflow-hidden mb-0">
                <View className="flex-row items-stretch justify-left w-full h-10 self-center px-1">
                    <Text className="text-1xl text-left text-gray-400 w-1/2 pl-[8%]">Item</Text>
                    <Text className="text-1xl text-right text-gray-400 w-1/5 pr-[2%]">Split by</Text>
                    <Text className="text-1xl text-right text-gray-400 w-1/5 pr-[2%]">Quantity</Text>
                </View>
                {Object.keys(groceryItems).length > 0 ? (
                    <FlatList 
                    className="h-full"
                    data={Object.keys(groceryItems)}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    />
                ) : (
                    <View>
                        <Text className="text-3xl font-semibold text-center">Your list is empty!</Text>
                        <Text className="text-1xl text-center">Hit the "add" button to begin creating your shared list</Text>
                    </View>
                )}
            </View>
            <NavBar />

            <Link href="/" asChild>
                <Pressable 
                    className="absolute w-fit h-8 items-center justify-center left-10 bottom-20 bg-[#3e5636] hover:bg-gray-600 py-2.5 px-4 rounded-lg shadow-lg"
                >
                    <Text className="text-white text-center self-center">See Past Items</Text>
                </Pressable>
            </Link>
            <Pressable 
                className="absolute w-10 h-8 items-center justify-center right-12 bottom-20 shadow-lg"
                onPress={toggleModal}
            >
                <Ionicons name="add-circle" size={76} color="#3e5636"/>
            </Pressable>
            
            <Modal 
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View className="w-2/3 h-1/3 m-auto bg-white rounded-lg p-10 align-center">
                    <Ionicons
                        name='close'
                        size={24}
                        onPress={toggleModal}/>
                    <Text className="self-center">Add Item</Text>
                    <TextInput
                        className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
                        onChangeText={setItem}
                        value={item}
                        placeholder="Add Item..."
                        onKeyPress={handleWriteItem}
                    />
                    <Pressable 
                        className="bg-[#3e5636] hover:bg-gray-600 py-2.5 px-4 w-fit self-center rounded-lg"
                        onPress={writeItem}
                        >
                        <Text className="text-white text-center self-center">Add</Text>
                    </Pressable>
                    <Pressable 
                        className="bg-[#3e5636] hover:bg-gray-600 mt-6 py-2.5 px-4 w-fit self-center rounded-lg"
                        >
                        <Text className="text-white text-center self-center">See All Past Items</Text>
                    </Pressable>
                </View>
            </Modal>

        </View>
        </View>
    );
}