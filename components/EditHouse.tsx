import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, TextInput, View } from 'react-native';

import { getHouseNameFromId, updateHouseName } from '../api/house';

import Button from './CustomButton';

type EditHouseProps = {
  houseId: string;
  visible: boolean;
  onClose: () => void;
  onNameChange: (newName: string) => void;
};

const EditHouse = ({ houseId, visible, onClose, onNameChange }: EditHouseProps) => {
  const [houseName, setHouseName] = useState('');

  useEffect(() => {
    if (visible) {
      const getHouseName = async () => {
        try {
          let name = await getHouseNameFromId(houseId);
          console.log("houseName:", name);
          setHouseName(name);
        } catch (err) {
          console.error("Error when getting house name:", err);
        }
      }

      getHouseName();
    }
  }, [visible]);

  const saveChanges = async () => {
    if (houseName && houseName.length > 0) {
      try {
        await updateHouseName(houseName, houseId);
        onNameChange(houseName);
      } catch (err) {
        console.error("Error when changing house name:", err);
      }
    }
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
              onChangeText={setHouseName}
              value={houseName}
              autoCapitalize="none"
            />
          </View>
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm"></Button>
        </View>
      </View>
    </Modal>
  );
};

export default EditHouse;
