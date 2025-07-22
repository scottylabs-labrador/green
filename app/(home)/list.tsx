import { View, Text, Pressable, Modal, FlatList, TextInput, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { writeGroceryItem } from "../../api/grocerylist";
import { useLocalSearchParams, useRouter, Link } from "expo-router"; 
import { getCurrentUser } from "../../api/firebase";
import GroceryItem from '../../components/GroceryItem';
import { Ionicons } from '@expo/vector-icons';
import { onAuthChange } from '../../api/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getGroceryListId } from "../../api/grocerylist";
import emptyList from "../../assets/empty-list.png";

export default function List() {
    const router = useRouter();
    const { grocerylist } = useLocalSearchParams();

    const isValid = typeof grocerylist === 'string' && grocerylist.trim() !== '';
    if (!isValid) {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const groceryListId = await getGroceryListId();
                router.replace({ pathname: '/list', params: { grocerylist: groceryListId } });
            }
        });
    }

    const [groceryItems, setGroceryItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [item, setItem] = useState('');
    const [email, setEmail] = useState('email');
    const [colors, setColors] = useState({});
    const [houseId, setHouseId] = useState('');
    const [houseName, setHouseName] = useState('');
    const [date, setDate] = useState('');

    const db = getDatabase();

    useEffect(() => {
        const unsubscribeAuth = onAuthChange((user) => {
            if (user) {
                const email = getCurrentUser()?.email || '';
                const filteredEmail = email.split('.').join(':');
                setEmail(filteredEmail);

                const itemRef = ref(db, 'housemates/' + filteredEmail);
                onValue(itemRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data?.houses?.[0]) {
                        const houses = data.houses[0].toString();
                        setHouseId(houses);

                        const houseRef = ref(db, 'houses/' + houses);
                        onValue(houseRef, (snapshot) => {
                            const data = snapshot.val();
                            if (data) {
                                setColors(data.members || {});
                                setHouseName(data.name || '');
                            }
                        });
                    }
                });
            } else {
                // Redirect to login if no user found
                router.replace('/login');
            }
        });

        return () => unsubscribeAuth();
    }, [db, router]);

    useEffect(() => {
        if (!grocerylist) return;

        const itemRef = ref(db, `grocerylists/${grocerylist}/groceryitems`);
        const unsubscribeItems = onValue(itemRef, (snapshot) => {
            const data = snapshot.val();
            setGroceryItems(data || {});
        });

        return () => unsubscribeItems();
    }, [db, grocerylist]);

    useEffect(() => {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1);
        const day = String(currentDate.getDate());
        const year = String(currentDate.getFullYear()).slice(-2);
        setDate(`${month}.${day}.${year}`);
    }, []);

    const toggleModal = () => setModalVisible(!modalVisible);

    const renderItem = ({ item }) => (
        <GroceryItem
            key={item}
            grocerylist={grocerylist}
            id={item}
            name={groceryItems[item]?.name}
            quantity={groceryItems[item]?.quantity}
            splits={groceryItems[item]?.splits}
            member={email}
            colors={colors}
        />
    );

    const writeItem = () => {
        if (!item.trim()) return;
        writeGroceryItem(grocerylist, item, email);
        setItem('');
        toggleModal();
    };

    const handleWriteItem = (e) => {
        const key = e.nativeEvent.key;
        if (key === "Enter") {
            writeItem();
        }
    };

    return (
        
        <View className="flex-1 items-center">
        <View className="flex-1 w-full h-full">
            <View className="flex flex-col justify-center items-center mt-16 mb-8 h-16">
                <Text className="text-1xl text-center text-white font-medium">Home</Text>
                <Text className="text-4xl text-center text-white font-medium">This week's list</Text>
                <View className="flex-row justify-between w-60">
                    <Text className="text-1xl text-left grow text-white font-light">{houseName}</Text>
                    <Text className="text-1xl text-right text-white font-light">{date}</Text>
                </View>
            </View>
            <View className="w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] pt-6 pb-24 overflow-hidden mb-0">
                <View className="flex-row items-stretch justify-left w-full h-10 self-center px-6">
                    <Text className="text-1xl text-left text-gray-400 w-1/2 pl-4">Item</Text>
                    <Text className="text-1xl text-right text-gray-400 w-1/4 pr-1">Split by</Text>
                    <Text className="text-1xl text-right text-gray-400 w-20 pr-3">Quantity</Text>
                </View>
                {groceryItems && Object.keys(groceryItems).length > 0 ? (
                    <FlatList 
                    className="h-full"
                    data={Object.keys(groceryItems)}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    contentContainerStyle={{ gap: 8 }}
                    />
                ) : (
                    <View className="flex-1 flex justify-center items-center">
                        <View className="flex justify-center items-center w-3/4">
                            <Image 
                                source={emptyList}
                                resizeMode="contain"
                            />
                            <Text className="text-3xl font-semibold text-center text-soft-green">Your list is empty!</Text>
                            <Text className="text-1xl text-center text-soft-green">Hit the "add" button to begin creating your shared list</Text>
                        </View>
                    </View>
                )}
            </View>

            <Link href={{pathname: "/pastlists", params: { houseId: houseId }}} asChild>
                <Pressable 
                    className="absolute w-fit h-fit items-center justify-center left-10 bottom-8 bg-emerald-900 hover:bg-emerald-950 py-2.5 px-4 rounded-lg shadow-lg"
                >
                    <Text className="text-white text-center self-center">See Past Items</Text>
                </Pressable>
            </Link>
            <Pressable 
                className="absolute w-20 h-20 items-center justify-center right-8 bottom-6 shadow-lg"
                onPress={toggleModal}
            >
                <Ionicons name="add-circle" size={76} color="#164e2d"/>
            </Pressable>
            
            <Modal 
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View className="w-2/3 h-fit m-auto bg-white shadow-md rounded-lg py-5 px-7 align-center">
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
                        className="bg-emerald-900 hover:bg-gray-600 py-2.5 px-4 w-fit self-center rounded-lg"
                        onPress={writeItem}
                        >
                        <Text className="text-white text-center self-center">Add</Text>
                    </Pressable>
                    <Pressable 
                        className="bg-emerald-900 hover:bg-gray-600 mt-6 py-2.5 px-4 w-fit self-center rounded-lg"
                        >
                        <Text className="text-white text-center self-center">See All Past Items</Text>
                    </Pressable>
                </View>
            </Modal>

        </View>
        </View>
    );
}
