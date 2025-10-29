import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, TextInput, View } from 'react-native';

import { updateUser, updateUserColor } from '../api/auth';

import ColorPicker from './ColorPicker';
import Button from './CustomButton';
import Loading from './Loading';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNewName(name);
  }, [name]);

  useEffect(() => {
    setNewColor(color);
  }, [name, color]);

  const saveChanges = async () => {
    setLoading(true);

    if (newName && newName !== name && newName.length > 0) {
      try {
        await updateUser(userId, newName);
        onNameChange(newName);
      } catch (err) {
        console.error("Error when changing user name:", err);
        setError("Failed to update name.");
        setLoading(false);
        return;
      }
    }
    if (newColor && newColor !== color) {
      try {
        await updateUserColor(userId, houseId, newColor);
        onColorChange(newColor);
      } catch (err) {
        console.error("Error when changing user color:", err);
        setError("Failed to update color.");
        setLoading(false);
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
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm"></Button>
          {loading && (
            <View className="absolute inset-0 bg-white/70 justify-center items-center rounded-2xl">
              <Loading message="Updating profile..." />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default EditProfile;
