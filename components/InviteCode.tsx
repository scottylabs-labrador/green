import React, { useEffect, useState } from 'react';

import { createInviteCode } from '@/api/house';
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { getAuth } from 'firebase/auth';
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from 'react-native';

type InviteCodeProps = {
  houseId: string;
  visible: boolean;
  onClose: () => void;
};

const InviteCode = ({ houseId, visible, onClose }: InviteCodeProps) => {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const handleCreateCode = async () => {
        setCopied(false);
        setLoading(true);

        const userId = getAuth().currentUser?.uid;
        if (!userId) {
          setError('You must be logged in.');
          setLoading(false);
          return;
        }

        if (!houseId) {
          setError('Need a valid house to generate a join link.');
          setLoading(false);
          return;
        }

        try {
          const newLink = await createInviteCode(houseId);
          setLink(newLink);
          setError('');
          setLoading(false);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to generate invite link.');
          setLoading(false);
        }
      };

      handleCreateCode();
    }
  }, [visible]);

  const handleCopy = async () => {
    if (link) {
      await Clipboard.setStringAsync(link);
      Alert.alert('Copied to clipboard!');
      setCopied(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons name="close" size={24} onPress={onClose} className="absolute right-3 top-3" />
          <Text className="text-center text-lg font-medium">Invite Code</Text>
          <Text className="mt-3 text-gray-500">This code expires in 24 hours. </Text>
          {link ? (
            <View className="mt-4 flex-row gap-3 justify-center items-center">
              <Text className="w-full text-left font-medium">Join Code</Text>
              <Text className="flex-shrink text-gray-500">{link}</Text>
              <Pressable className={`flex justify-center items-center rounded-full w-6 h-6`}>
                {copied 
                  ? <Entypo 
                      name="check" 
                      size={20} 
                      color="green"
                      onPress={handleCopy} />
                  : <FontAwesome6
                      name="copy"
                      size={18}
                      color="gray"
                      onPress={handleCopy}
                    />
                }
              </Pressable>
            </View>
          ) : loading ? (
            <View className="mt-4 flex-row items-center justify-center gap-3">
              <Text className="w-full text-left">Generating Invite Code</Text>
              <ActivityIndicator size="small" />
            </View>
          ) : <Text className="mt-4 text-red-500">Encountered error while generating invite code</Text>}
          {error ? <Text className="mt-4 text-red-500">Error: {error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

export default InviteCode;
