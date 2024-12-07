import { View, Text, Pressable, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, get } from "firebase/database";
import { Link, router, useLocalSearchParams } from "expo-router"; 
import { Octicons } from '@expo/vector-icons';
import NavBar from '../../components/NavBar';
import ReceiptItem from '../../components/ReceiptItem';

export default function UnmatchedItem() {
    const { item_id } = useLocalSearchParams();
    const [itemName, setItemName] = useState('');
    const [matchedItems, setMatchedItems] = useState([]);
    const [unmatchedItems, setUnmatchedItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
      const db = getDatabase();
      onValue(ref(db, 'groceryitems/' + item_id), (snapshot) => {
        const data = snapshot.val();
        setItemName(data.name);
      });
    }, [item_id]);

    useEffect(() => {
        const fetchData = () => {
            const db = getDatabase();
            const matchedItemRef = ref(db, 'groceryitems/');
            const unmatchedItemRef = ref(db, 'groceryitems/');
            get(matchedItemRef).then((snapshot) => {
                const data = snapshot.val();
                setMatchedItems(data);
            });
            get(unmatchedItemRef).then((snapshot) => {
                const data = snapshot.val();
                setUnmatchedItems(data);
            });
        }

        fetchData();
    }, [matchedItems, unmatchedItems]);

    const toggleOption = (value: string) => {
      setSelectedItems((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
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
        <View className="flex-row items-center justify-start w-full h-12 self-center px-2 border-y border-gray-200">
            <Text className="text-1xl text-left font-medium w-1/2 grow">{name}</Text>
            <Octicons
              name="check-circle-fill" 
              size={20} 
              color={selectedItems.includes(id) ? '#1cb022' : 'lightgray'}
              onPress={() => toggleOption(id)}/>
        </View>
      )
    }

    const renderUnmatchedItem = ({ item }) => {
        return (
            <UnmatchedItem
                key={item}
                id={item}
                name={unmatchedItems[item].name}
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
                  <Pressable className="absolute top-6 right-6 w-fit h-fit">
                    <Link href="/bill" className="w-full h-full">
                      <Octicons
                          name="x" 
                          size={24} 
                          color="black"/>
                    </Link>
                  </Pressable>
                  <Text className="text-3xl text-left font-medium text-black underline">{itemName}</Text>
                  <Text className="text-2xl text-left font-medium text-black">Unmatched items in list:</Text>
                  <Text className="text-1xl text-left text-black">Match the product to a grocery list item from this week!</Text>
                  {Object.keys(unmatchedItems).length > 0 ? (
                      <FlatList 
                          className="h-full"
                          data={Object.keys(unmatchedItems)}
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
              <NavBar />
          </View>
        </View>
    );
}