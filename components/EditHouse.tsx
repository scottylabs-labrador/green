import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, TextInput, View } from 'react-native';

import { updateHouseName } from '../api/house';

import Button from './CustomButton';

type EditHouseProps = {
  houseId: string;
  houseName: string;
  visible: boolean;
  onClose: () => void;
  onNameChange: (newName: string) => void;
};

const EditHouse = ({ houseId, houseName, visible, onClose, onNameChange }: EditHouseProps) => {
  const [newHouseName, setNewHouseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNewHouseName(houseName);
  }, [houseName]);

  const saveChanges = async () => {
    setLoading(true);

    if (newHouseName && newHouseName.length > 0) {
      try {
        await updateHouseName(newHouseName, houseId);
        onNameChange(newHouseName);
      } catch (err) {
        console.error("Error when changing house name:", err);
        setLoading(false);
        setError("Failed to update house name.");
        return;
      }
    }

    setLoading(false);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium">Edit House</Text>
          <View className="px-2 mb-2">
            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setNewHouseName}
              value={newHouseName}
              autoCapitalize="none"
            />
          </View>
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm" isLoading={loading}></Button>        
        </View>
      </View>
    </Modal>
  );
};

export default EditHouse;
