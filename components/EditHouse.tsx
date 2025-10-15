import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, TextInput, View } from 'react-native';

type EditHouseProps = {
  houseId: string;
  visible: boolean;
  onClose: () => void;
};

const EditHouse = ({ houseId, visible, onClose }: EditHouseProps) => {
  const [houseName, setHouseName] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium">Edit House</Text>
          <View className="px-2">
            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setHouseName}
              value={houseName}
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditHouse;
