import { View, Text, Pressable, TouchableOpacity, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
import { Link, useRouter, useLocalSearchParams } from "expo-router"; 
import { Octicons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import { onAuthChange } from "../api/auth";
import { getCurrentUser, matchReceiptItem } from "../api/firebase";

export default function UnmatchedItem( ) {
    const { itemId, receiptId } = useLocalSearchParams();
    const [itemName, setItemName] = useState('');
    const [groceryItems, setGroceryItems] = useState({});
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const db = getDatabase();
    const router = useRouter();

    type groceryListType = {
      name: String,
      quantity: number,
      splits: String[]
    }

    useEffect(() => {
      onValue(ref(db, 'receipts/'+receiptId+'/receiptitems/'+itemId), (snapshot) => {
        const data = snapshot.val();
        console.log("grocery item: " + data.groceryItem);
        setItemName(data.receiptItem);
        setSelectedItem(data.groceryItem);
      });
    }, []);

    useEffect(() => {
        const getGroceryList = onAuthChange((user) => {
          if (user) {
            let email = getCurrentUser().email;
            var emailParts = email.split(".");
            var filteredEmail = emailParts[0] + ":" + emailParts[1];
            const dbRef = ref(db);
            get(child(dbRef, `housemates/${filteredEmail}`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  // console.log("data for house:" + data.houses[0].toString());
                  let houses = data.houses[0].toString();
                  const houseRef = child(dbRef, `houses/${houses}`);
                  return get(houseRef);
                }
                else {
                  console.log("failed to get houses");
                  return Promise.reject("no house found");
                }
              })
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  // console.log("data for grocery lists:" + data.grocerylist);
                  let groceryList = data.grocerylist;
                  const itemRef = child(dbRef, `grocerylists/${groceryList}`);
                  return get(itemRef);
                }
                else {
                  console.log("failed to get grocery list");
                  return Promise.reject("no grocery list")
                }
              })
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  console.log("grocery items: ", data.groceryitems)
                  setGroceryItems(data.groceryitems);
                }
                else {
                  console.log("failed to get grocery items");
                }
              });
          }
          else {
            console.log("no user");
            window.location.href = "/login"; // Redirect if not logged in
          }
        });
      }, []);

    const toggleOption = (id: string) => {
      setSelectedItem(groceryItems[id].name);
    };

    const ProfileButton = () => {
      return (
        <Pressable className="w-10 h-10 justify-center items-center bg-sky-200 rounded-full ">
          <Text className="text-2xl text-white">A</Text>
        </Pressable>
      )
    }

    const UnmatchedItem = ({ id, name }) => {
      return (
        <Pressable 
          className="flex-row items-center justify-start w-full h-12 self-center px-2 border-y border-gray-200"
          onPress={() => toggleOption(id)}>
            <Text className="text-1xl text-left font-medium w-1/2 grow">{name}</Text>
            <Octicons
              name="check-circle-fill" 
              size={20} 
              color={selectedItem == name ? '#1cb022' : 'lightgray'}
            />
        </Pressable>
      )
    }

    const renderUnmatchedItem = ({ item }) => {
        return (
            <UnmatchedItem
                key={item}
                id={item}
                name={groceryItems[item].name}
            />
        );
    }

    return (
        <View className="flex-1 items-center">
          <View className="flex-1 w-full h-full bg-[#6d0846]">
              <View className="mt-14 mb-12 w-fit gap-2 self-center">
                  <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
                  <Text className="text-4xl text-center text-white font-medium">Unmatched Item</Text>
              </View>
              <View className="relative gap-2 w-full h-[200px] flex-grow bg-white self-end rounded-3xl p-8 overflow-hidden mb-24">
                    <Link 
                      href={{pathname: '/bill', 
                           params: { receiptId: receiptId }
                         }} 
                      onPress={() => {
                        if (selectedItem !== "") {
                          matchReceiptItem(receiptId, itemId, selectedItem);
                        }
                      }}
                      className="absolute top-4 right-6 w-fit h-fit" 
                      asChild>
                        <Pressable className="absolute top-4 right-6">
                        <Octicons
                            name="x" 
                            size={24} 
                            color="black"/>
                        </Pressable>
                    </Link>
                  <Text className="text-3xl text-left font-medium text-black underline">{itemName}</Text>
                  <Text className="text-2xl text-left font-medium text-black">Unmatched items in list:</Text>
                  <Text className="text-1xl text-left text-black">Match the product to a grocery list item from this week!</Text>
                  {Object.keys(groceryItems).length > 0 ? (
                      <FlatList 
                          className="h-full"
                          data={Object.keys(groceryItems)}
                          renderItem={renderUnmatchedItem}
                          keyExtractor={item => item}
                      />
                  ) : (
                      <View>
                          <Text className="text-3xl font-semibold text-center">Your list is empty!</Text>
                          <Text className="text-1xl text-center">Hit the "add" button to begin creating your shared list</Text>
                      </View>
                  )}
                  <Text className="text-2xl text-left font-medium text-black my-2">Claimed by:</Text>
                  <View>
                    <ProfileButton/>
                  </View>
              </View>
              <NavBar location="unmatched"/>
          </View>
        </View>
    );
}