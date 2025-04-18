import { View, Text, Pressable, TouchableOpacity, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Octicons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import { onAuthChange } from "../api/auth";
import { getCurrentUser, matchReceiptItem, updateItemPrice, deleteReceiptItem } from "../api/firebase";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function UnmatchedItem() {
  const { itemId, receiptId } = useLocalSearchParams();
  const [itemName, setItemName] = useState('');
  const [groceryItems, setGroceryItems] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const [colors, setColors] = useState({});
  const [price, setPrice] = useState('');
  const [splits, setSplits] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // const [newItem, setNewItem] = useState('');
  const db = getDatabase();

  type groceryListType = {
    name: String,
    quantity: number,
    splits: String[]
  }

  useEffect(() => {
    onValue(ref(db, 'receipts/' + receiptId + '/receiptitems/' + itemId), (snapshot) => {
      const data = snapshot.val();
      console.log("splits: " + data.price);
      setItemName(data.receiptItem);
      setSelectedItem(data.groceryItem);
      setPrice(data.price.toFixed(2).toString());
      setSplits(data.splits);
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
              let members = data.members;
              setColors(members);
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
    setSplits(groceryItems[id].splits);
  };

  const ProfileButton = () => {
    return (
      <Pressable className="w-10 h-10 justify-center items-center bg-sky-200 rounded-full ">
        <Text className="text-2xl text-white">A</Text>
      </Pressable>
    )
  }

  const renderColor = ({ item }) => {
    try{
      return (
        // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
        <View className="w-10 h-10 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ colors[splits[item]].color}}>
            <Text className="text-2xl w-1/2 self-center text-center text-white">{colors[splits[item]].name[0].toUpperCase()}</Text>
        </View>
      );
    }
    catch{
        return (
            // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
            <View className="w-10 h-10 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#FFFFFF"}}>
                <Text className="text-2xl w-1/2 self-center text-center text-white">U</Text>
            </View>
          );
    }
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

  const createNewItem = (item: string) => {
    console.log("create", item);
    setSelectedItem(item);
    setSplits([]);
  }

  const AddNewItem = ({ onSubmit }) => {
    const [newItem2, setNewItem2] = useState('');

    const handleSubmit = () => {
      console.log("new item: ", newItem2);
      onSubmit(newItem2);
      setNewItem2(newItem2);
      // setSelectedItem(text);
      // setSplits([]);
    }

    return (
      <View className="flex-row items-center justify-start w-full h-12 self-center px-2 border-y border-gray-200 focus:bg-black">
          <TextInput 
              className="text-gray-400 text-left w-1/2 grow h-fit rounded-md outline-none" 
              placeholder="New Item"
              value={newItem2}
              onChangeText={setNewItem2}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}/>
          <Octicons
            name="check-circle-fill"
            size={20}
            color={selectedItem == newItem2 ? '#1cb022' : 'lightgray'}
          />
      </View>
    )
  }

  const handlePriceChange = (value: string) => {
    let sanitized = value.replace(/[^\d.]/g, '');

    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    const [integerPart, decimalPart] = sanitized.split('.');
    if (decimalPart !== undefined) {
      sanitized = `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    setPrice(sanitized);
  };

  return (
    <View className="flex-1 items-center">
      <View className="flex-1 w-full h-full bg-[#6d0846]">
        <View className="mt-14 mb-12 w-fit gap-2 self-center">
          <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
          <Text className="text-4xl text-center text-white font-medium">Unmatched Item</Text>
        </View>
        <View className="relative gap-2 w-full h-[200px] flex-grow bg-white self-end rounded-3xl p-8 overflow-hidden mb-24">
          <Link
            href={{
              pathname: '/bill',
              params: { receiptId: receiptId }
            }}
            // onPress={() => {
            //   if (selectedItem !== "") {
            //     matchReceiptItem(receiptId, itemId, selectedItem, splits);
            //   }
            //   updateItemPrice(receiptId, itemId, parseFloat(price));
            // }}
            className="absolute top-4 right-6 w-fit h-fit"
            asChild>
            <Pressable className="absolute top-4 right-6">
              <Octicons
                name="x"
                size={24}
                color="black" />
            </Pressable>
          </Link>
          <Text className="text-3xl text-left font-medium text-black underline">{itemName}</Text>
          <Text className="text-left text-black">Match the product to a grocery list item from this week!</Text>
          {Object.keys(groceryItems).length > 0 ? (
            <FlatList
              className="h-full"
              data={Object.keys(groceryItems)}
              renderItem={renderUnmatchedItem}
              keyExtractor={item => item}
              ListFooterComponent={
                <AddNewItem
                  onSubmit={createNewItem}/>
              }
            />
          ) : (
            <View>
              <Text className="text-3xl font-semibold text-center">Your list is empty!</Text>
              <Text className="text-1xl text-center">Hit the "add" button to begin creating your shared list</Text>
            </View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl text-left font-medium text-black">Price:</Text>
            <TextInput 
              className="text-center w-14 h-fit bg-slate-100 p-2 border-solid rounded-md" 
              placeholder={`${price}`}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={handlePriceChange}
              />
          </View>
          <Text className="text-2xl text-left font-medium text-black">Claimed by:</Text>
          <View>
            {splits ? <FlatList 
                            className="v-full h-10 p-0 mt-1"
                            data={Object.keys(splits)}
                            renderItem={renderColor}
                            keyExtractor={item => item}
                            horizontal={true} 
                            contentContainerStyle={{ gap: 5 }}
                            />
                        : <View></View>}
          </View>
          <View className="absolute right-6 bottom-8 flex flex-row gap-3 justify-center items-center">
            <Pressable className="">
              <Link
                href={{
                  pathname: '/bill',
                  params: { receiptId: receiptId }
                }}
                onPress={() => deleteReceiptItem(receiptId, itemId)}>
                <FontAwesome6 name="trash-can" size={24} color="gray" />
              </Link>
            </Pressable>
            {selectedItem ? 
              <Pressable>
                <Link
                  href={{
                    pathname: '/bill',
                    params: { receiptId: receiptId }
                  }}
                  onPress={() => {
                    if (selectedItem !== "") {
                      matchReceiptItem(receiptId, itemId, selectedItem, splits);
                    }
                    updateItemPrice(receiptId, itemId, parseFloat(price));
                  }}>
                  <Octicons
                    name="check-circle-fill"
                    size={24}
                    color="#064e3b"
                  />
                </Link>
              </Pressable>
              : <View></View>}
          </View>
        </View>
        <NavBar location="unmatched" />
      </View>
    </View>
  );
}