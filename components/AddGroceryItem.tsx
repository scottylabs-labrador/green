import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, NativeSyntheticEvent, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';

import { writeGroceryItem } from '@/api/grocerylist';
import Button from './CustomButton';

type AddGroceryItemProps = {
  userId: string | undefined;
  groceryListId: string;
  visible: boolean;
  onClose: () => void;
};

const AddGroceryItem = ({ userId, groceryListId, visible, onClose }: AddGroceryItemProps) => {
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const writeItem = async () => {
    if (!item.trim()) return;
    if (!userId) return;

    setLoading(true);

    try {
      await writeGroceryItem(groceryListId, item, userId);

      setItem('');
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Error while adding item:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleWriteItem = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    if (key === 'Enter') {
      writeItem();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium mb-4">Add Item</Text>
          <View className="px-2 mb-4">
            <TextInput
              className={`block w-full rounded-lg border border-gray-300 bg-white p-2.5 align-middle text-sm ${item ? 'text-gray-900' : 'text-gray-500'} focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
              onChangeText={setItem}
              value={item}
              placeholder="Item..."
              onKeyPress={handleWriteItem}
            />
          </View>
          {error.length > 0 && (
            <Text className="text-red-500 mb-4 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Add Item" onPress={writeItem} fontSize="text-sm" isLoading={loading}></Button>
        </View>
      </View>
    </Modal>
  );
};

export default AddGroceryItem;
