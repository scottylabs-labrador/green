import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, Text, View } from 'react-native';
import { createInviteCode } from '../api/join';
import CustomButton from './CustomButton';

type EditHouseProps = {
  houseId: string;
  visible: boolean;
  onClose: () => void;
};

const EditHouse = ({ houseId, visible, onClose }: EditHouseProps) => {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleCreateCode = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      setError('You must be logged in.');
      return;
    }

    if (!houseId) {
      setError('Need a valid house to generate a join link.');
      return;
    }

    try {
      const newLink = await createInviteCode(houseId);
      setLink(newLink);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate invite link.');
    }
  };

  const handleCopy = async () => {
    if (link) {
      await Clipboard.setStringAsync(link);
      Alert.alert('Copied to clipboard!');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />

          <CustomButton buttonLabel="Generate Join Code" onPress={handleCreateCode} fontSize="text-md"/>

          {link ? (
            <View className="flex-row mt-4 px-2 gap-3">
              <Text className="mb-1 w-full text-left font-medium">Join Code</Text>
              <Text className="flex-shrink text-gray-500">
                {link}
              </Text>
              <FontAwesome6
                className="ml-2"
                name="copy"
                size={20}
                color="gray"
                onPress={handleCopy}
              />
            </View>
          ) : null}

          {error ? <Text className="mt-3 text-red-500">Error: {error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

export default EditHouse;
