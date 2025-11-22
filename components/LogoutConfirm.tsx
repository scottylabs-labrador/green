import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Text, View } from 'react-native';

import { userSignOut } from '../api/auth';

import Button from './CustomButton';

type LogoutConfirmProps = {
  visible: boolean;
  onClose: () => void;
};

const LogoutConfirm = ({ visible, onClose }: LogoutConfirmProps) => {
  const [error, setError] = useState('');

  const handleSignOut = () => {
    try {
      userSignOut();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium mb-1">Logout</Text>
          <Text className="text-center text-gray-500 mb-8">Are you sure you want to logout?</Text>
          {error.length > 0 && (
            <Text className="text-red-500 mb-2 px-2">
              Error: {error}
            </Text>
          )}
          <Button buttonLabel="Logout" onPress={handleSignOut} fontSize="text-sm" color="bg-red-500" hoverColor="bg-red-600"></Button>
          <Text className="text-red-500 font-medium text-center" onPress={onClose}>
            Cancel
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirm;
