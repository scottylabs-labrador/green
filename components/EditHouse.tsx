import { useState } from 'react';
import { View, Text, Modal, Alert } from 'react-native';
import { createInviteLink } from '../api/join';
import React from 'react';
import { getAuth } from 'firebase/auth';
import CustomButton from './CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Clipboard from 'expo-clipboard';

type EditHouseProps = {
  houseId: string;
  visible: boolean;
  onClose: () => void;
}

const EditHouse = ({ houseId, visible, onClose }: EditHouseProps) => {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleCreateLink = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      setError("You must be logged in.");
      return;
    }

    if (!houseId) {
      setError("Need a valid house to generate a join link.");
      return;
    }

    try {
      const newLink = await createInviteLink(houseId);
      setLink(newLink);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate invite link.');
    }
  }

  const handleCopy = async () => {
    if (link) {
      await Clipboard.setStringAsync(link);
      Alert.alert('Copied to clipboard!');
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="relative bg-white p-5 rounded-2xl w-[85%] shadow-md">
        <Ionicons
          name='close'
          size={24}
          onPress={onClose}
          className="absolute right-3 top-3"/>
          <Text className="text-xl font-bold mb-4">Generate Invite Link</Text>

          <CustomButton buttonLabel="Generate Join Link" onPress={handleCreateLink} />

          {link ? (
            <View className="mt-4">
              <Text className="font-medium mb-1 text-left w-full">Invite Link</Text>
              <View className="flex flex-row items-center justify-start space-x-2 w-full">
                <Text selectable className="text-gray-500 flex-shrink">{link}</Text>
                <FontAwesome6 className="ml-2" name="copy" size={20} color="gray" onPress={handleCopy} />
              </View>
            </View>
          ) : null}

          {error ? (
            <Text className="text-red-500 mt-3">Error: {error}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}

export default EditHouse