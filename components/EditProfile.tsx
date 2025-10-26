import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, TextInput, View } from 'react-native';

import { updateUser, updateUserColor } from '../api/auth';

import ColorPicker from './ColorPicker';
import Button from './CustomButton';

type EditProfileProps = {
  userId: string;
  name: string;
  houseId: string;
  color: string;
  visible: boolean;
  onClose: () => void;
  onNameChange: (newName: string) => void;
  onColorChange: (newColor: string) => void;
};

const EditProfile = ({ userId, name, houseId, color, visible, onClose, onNameChange, onColorChange }: EditProfileProps) => {
  const [newName, setNewName] = useState(name);
  const [newColor, setNewColor] = useState(name);

  const saveChanges = async () => {
    if (newName && newName !== name && newName.length > 0) {
      try {
        await updateUser(userId, newName);
        onNameChange(newName);
      } catch (err) {
        console.error("Error when changing user name:", err);
      }
    }
    if (newColor && newColor !== color) {
      try {
        await updateUserColor(userId, houseId, color);
        onColorChange(newColor);
      } catch (err) {
        console.error("Error when changing user color:", err);
      }
    }
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium">Edit Profile</Text>
          <View className="px-2 mb-2">
            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              onChangeText={setNewName}
              value={newName}
              autoCapitalize="none"
            />
          </View>
          <View className="px-2 mb-2">
            <Text className="mb-2">Color</Text>
            <ColorPicker color={color} onColorPick={setNewColor} />
          </View>
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm"></Button>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfile;
