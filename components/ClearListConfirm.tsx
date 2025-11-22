import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, View } from 'react-native';


import { clearGroceryItems } from '@/api/grocerylist';
import Button from './CustomButton';

type ClearListConfirmProps = {
  groceryListId: string;
  visible: boolean;
  onClose: () => void;
};

const ClearListConfirm = ({ groceryListId, visible, onClose }: ClearListConfirmProps) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    setLoading(true);

    try {
      await clearGroceryItems(groceryListId);
      setLoading(false);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium mb-1">Clear All Grocery Items</Text>
          <Text className="text-center text-gray-500 mb-6">Are you sure you want to delete all grocery items?</Text>
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Clear List" onPress={handleDeleteAll} fontSize="text-sm" color="bg-red-500" hoverColor="bg-red-600" isLoading={loading}></Button>
          <Text className="text-red-500 font-medium text-center" onPress={onClose}>
            Cancel
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ClearListConfirm;
