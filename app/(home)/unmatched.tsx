import { View, Text, Pressable, TouchableOpacity, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get, child } from "firebase/database";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Octicons } from '@expo/vector-icons';
import { onAuthChange } from "../../api/auth";
import { getCurrentUser, deleteReceiptItem, db } from "../../api/firebase";
import { updateReceiptItem } from "../../api/receipt";
import SplitProfile from '../../components/SplitProfile';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function UnmatchedItem() {
  var { itemId, receiptId } = useLocalSearchParams();
  const [userId, setUserId] = useState('');
  const [itemName, setItemName] = useState('');
  const [groceryItems, setGroceryItems] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const [colors, setColors] = useState({});
  const [price, setPrice] = useState('');
  const [splits, setSplits] = useState({});
  const [newItem, setNewItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const inSplit = 'outline outline-emerald-900 outline-offset-1';

  useEffect(() => {
    if (itemId !== undefined) {
      onValue(ref(db, 'receipts/' + receiptId + '/receiptitems/' + itemId), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setItemName(data.receiptItem);
          setSelectedItem(data.groceryItem);
          setPrice(data?.price.toFixed(2).toString());
          setSplits(data.splits);
        }
      });
    }
    else {
      itemId = window.crypto.randomUUID();
    }
  }, []);

  useEffect(() => {
    const getGroceryList = onAuthChange((user) => {
      if (user) {
        let email = getCurrentUser().email;
        var emailParts = email.split(".");
        var filteredEmail = emailParts[0] + ":" + emailParts[1];
        setUserId(filteredEmail);
        const dbRef = ref(db);
        get(child(dbRef, `housemates/${filteredEmail}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              let houses = data.houses[0].toString();
              const houseRef = child(dbRef, `houses/${houses}`);
              return get(houseRef);
            }
            else {
              console.error("failed to get houses");
              return Promise.reject("no house found");
            }
          })
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              let members = data.members;
              setColors(members);
              let groceryList = data.grocerylist;
              const itemRef = child(dbRef, `grocerylists/${groceryList}`);
              return get(itemRef);
            }
            else {
              console.error("failed to get grocery list");
              return Promise.reject("no grocery list")
            }
          })
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setGroceryItems(data.groceryitems);
            }
            else {
              console.error("failed to get grocery items");
            }
          });
      }
      else {
        console.error("no user");
        router.replace("/login"); // Redirect if not logged in
      }
    });
  }, []);

  const toggleOption = (id: string) => {
    setSelectedItem(groceryItems[id].name);
    setSplits(groceryItems[id].splits);
  };

  const toggleSplit = (id: string) => {
    if (splits && Object.keys(splits).includes(id)) {
      // setSplits(prev => prev.filter(elem => elem != id));
    }
    else if (splits) {
      // setSplits(prev => [...prev, id]);
    }
    else {
      let newSplits = {};
      newSplits[userId] = 1;
      setSplits(newSplits);
    }
  }

  const renderProfileButton = ({ item }) => {
    return (
      <Pressable className={`w-10 h-10 rounded-full self-center flex items-center justify-center ${splits && Object.keys(splits).includes(item) ? inSplit : ''}`} style={{ backgroundColor: "#"+ colors[item].color}}
                  onPress={() => toggleSplit(item)}>
        <Text className="text-2xl w-1/2 self-center text-center text-white">{colors[item].name[0].toUpperCase()}</Text>
      </Pressable>
    )
  }

  const renderColor = ({ item }) => {
    // return <SplitProfile
    //   key={item}
    //   colors={colors}
    //   item={item}
    //   size={10}
    //   fontSize={"2xl"}
    // />
    return <SplitProfile
          key={item}
          colors={colors}
          item={item}
          size={10}
          fontSize={"2xl"}
          quantity={splits[item]}
        />
    // try{
    //   return (
    //     // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
    //     <View className="w-10 h-10 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ colors[splits[item]].color}}>
    //         <Text className="text-2xl w-1/2 self-center text-center text-white">{colors[splits[item]].name[0].toUpperCase()}</Text>
    //     </View>
    //   );
    // }
    // catch{
    //     return (
    //         // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
    //         <View className="w-10 h-10 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#FFFFFF"}}>
    //             <Text className="text-2xl w-1/2 self-center text-center text-white">U</Text>
    //         </View>
    //       );
    // }
  }

  const AddSplit = () => {
    return (
      <View>
        <Pressable 
          className="w-10 h-10 items-center justify-center"
          onPress={toggleModal}
        >
          <Ionicons name="add-circle" size={36} color="lightgray"/>
        </Pressable>
      </View>
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

  const handleNewItem = (value: string) => {
    setNewItem(value);
    setSelectedItem(value);
    let newSplits = {};
    newSplits[userId] = 1;
    setSplits(newSplits);
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View className="flex-1 items-center">
      <View className="flex-1 w-full h-full">
        <View className="flex flex-col justify-center items-center mt-16 mb-8 h-16">
          <Text className="text-1xl text-center text-white font-medium">Scanned Receipt</Text>
          <Text className="text-4xl text-center text-white font-medium">Unmatched Item</Text>
        </View>
        <View className="relative w-full h-[200px] flex-grow bg-white self-end rounded-3xl p-8 overflow-hidden mb-8">
          <Link
            href={{
              pathname: '/bill',
              params: { receiptId: receiptId }
            }}
            className="absolute top-4 right-6 w-fit h-fit"
            asChild>
            <Pressable className="absolute top-4 right-6">
              <Octicons
                name="x"
                size={24}
                color="black" />
            </Pressable>
          </Link>
          <TextInput 
            className={`text-3xl text-left font-medium border-b border-gray-200 mb-2 ${itemName.length > 0 ? "text-black" : "text-gray-400"}`}
            placeholder="Item"
            value={itemName}
            onChangeText={setItemName}/> 
          <Text className="text-left text-black mb-2">Match the product to a grocery list item from this week!</Text>
          {Object.keys(groceryItems).length > 0 ? (
            <FlatList
              className="mb-2"
              data={Object.keys(groceryItems)}
              renderItem={renderUnmatchedItem}
              keyExtractor={item => item}
              ListFooterComponent={
                <View className="flex-row items-center justify-start w-full h-12 self-center px-2 border-y border-gray-200">
                  <TextInput 
                      className="text-gray-400 text-left w-1/2 grow h-fit rounded-md outline-none" 
                      placeholder="New Item"
                      value={newItem}
                      onChangeText={handleNewItem}/>
                  <Octicons
                    name="check-circle-fill"
                    size={20}
                    color={selectedItem == newItem ? '#1cb022' : 'lightgray'}
                  />
              </View>
              }
            />
          ) : (
            <View>
              <Text className="text-3xl font-semibold text-center">Your list is empty!</Text>
              <Text className="text-1xl text-center">Hit the "add" button to begin creating your shared list</Text>
            </View>
          )}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl text-left font-medium text-black">Price:</Text>
            <TextInput 
              className={`text-center w-14 h-fit bg-slate-100 p-2 border-solid rounded-md text-${price ? 'black' : 'slate-400'}`}
              placeholder={`0.00`}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={handlePriceChange}
              />
          </View>
          <Text className="text-2xl text-left font-medium text-black">Claimed by:</Text>
          <View className="">
            {splits ? <FlatList 
                        className="v-full h-10 p-0 mt-1"
                        data={Object.keys(splits)}
                        renderItem={renderColor}
                        keyExtractor={item => item}
                        horizontal={true} 
                        contentContainerStyle={{ gap: 5 }}
                        ListFooterComponent={
                          <AddSplit/>
                        }
                        />
                      : <AddSplit/>}
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
                    if (!itemId) {
                      itemId = window.crypto.randomUUID();
                    }
                    if (price.length == 0) {
                      setPrice('0.00');
                    }
                    updateReceiptItem(receiptId, itemId, itemName, selectedItem, splits, parseFloat(price));
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

          <Modal 
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            >
            <View className="w-2/3 h-36 m-auto bg-white shadow-md rounded-lg py-5 px-7 align-center">
                <Ionicons
                    name='close'
                    size={24}
                    onPress={toggleModal}/>
                <Text className="self-center">Add Split</Text>
                <FlatList 
                  className="v-full h-10 p-0 px-2 mt-1"
                  data={Object.keys(colors)}
                  renderItem={renderProfileButton}
                  horizontal={true}
                  keyExtractor={item => item}
                  contentContainerStyle={{ gap: 10 }}
                  />
              </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}