import React, { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import { updateUser, updateUserColor } from '@/api/auth';
import BackButton from '@/components/BackButton';
import ColorPicker from '@/components/ColorPicker';
import Button from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import { useHouseInfo } from '@/context/HouseContext';
import { useRouter } from 'expo-router';

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { houseId, color } = useHouseInfo();

  const [userId, setUserId] = useState(user?.uid || '');
  const [newName, setNewName] = useState(user?.displayName || '');
  const [newColor, setNewColor] = useState(color);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      setUserId(user.uid);
    }
  }, [user]);

  const saveChanges = async () => {
    if (user == null || !user.uid) {
      router.replace('/login');
    }

    setLoading(true);

    if (newName && newName !== user?.displayName && newName.length > 0) {
      try {
        await updateUser(userId, newName);
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
      } catch (err) {
        console.error("Error when changing user color:", err);
        setError("Failed to update color.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    router.push('/profile');
  }

  return (
    <KeyboardAvoidingView
      className="padding-24 w-full flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="h-full">
        <BackButton />
        <View className="mx-auto mt-16 flex-1 justify-center w-full px-8">
          <Text className="text-center text-lg font-medium">Edit Profile</Text>
          <View className="px-2 mb-2">
            <Text className="mb-2">Name</Text>
            <TextInput
              className="mb-2 block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900"
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
          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm" isLoading={loading}></Button>      
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
