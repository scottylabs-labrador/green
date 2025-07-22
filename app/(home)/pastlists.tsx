import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput, Image } from 'react-native';
import React, { useState, useEffect} from 'react';
import { getDatabase, ref, set, push, onValue, get, remove} from "firebase/database";
import { removeGroceryItem, writeGroceryItem, updateGroceryItem, writeGroceryItemGrocerylist } from "../../api/firebase";
import { Link, useLocalSearchParams, useRouter } from "expo-router"; 
import { getCurrentUser } from "../../api/firebase";
import PastList from '../../components/PastList';
import Button from '../../components/CustomButton';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { onAuthChange } from '../../api/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getGroceryListId } from "../../api/grocerylist";
import emptyList from "../../assets/empty-list.png";

export default function PastLists() {
    const router = useRouter();

    const { houseId } = useLocalSearchParams();

    const [pastLists, setPastLists] = useState({});
    const [houseName, setHouseName] = useState("Your House");
    const db = getDatabase();

    useEffect(() => {
        const fetchData = () => {
            const receiptRef = ref(db, "houses/"+houseId);
            get(receiptRef).then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                  if (data.receipts) {
                    setPastLists(data.receipts);
                  }
                  if (data.name) {
                    setHouseName(data.name);
                  }
                }
            });
        }
        fetchData();
      }, [db]);

    const renderItem = ({ item }) => {
        return (
            <PastList 
                key={item}
                receiptId={item}
                date={pastLists[item].date}
            />
        );
    }

    return (
        <View className="flex-1 items-center">
        <View className="flex-1 w-full h-full">
            <View className="flex flex-col justify-center items-center mt-16 mb-8 h-16">
                <Text className="text-4xl text-center text-white font-medium">List History</Text>
                <Text className="text-1xl text-center text-white font-light">{houseName}</Text>
            </View>
            <View className="w-full h-[200px] flex-grow bg-white self-end rounded-t-[40px] pt-10 pb-24 overflow-hidden mb-0">
                {pastLists && Object.keys(pastLists).length > 0 ? (
                    <FlatList 
                    className="h-full"
                    data={Object.keys(pastLists).reverse()}
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
                            <Text className="text-3xl font-semibold text-center text-apricot">Your list is empty!</Text>
                            <Text className="text-1xl text-center text-apricot">Hit the "home" button to begin creating your shared list</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
        </View>
    );
}