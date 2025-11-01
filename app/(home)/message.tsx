import React, { useEffect, useState } from 'react';

import Feather from '@expo/vector-icons/Feather';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { getUserName } from '@/api/auth';
import { listenForReceipt } from '@/api/receipt';

import { calculateSplits } from '../../api/splits';

export default function Message() {
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();

  const [splitPrices, setSplitPrices] = useState<Record<string, number>>({});
  const [message, setMessage] = useState(
    `Hi friends, I bought this week's groceries! Here is the breakdown:\n`,
  );

  useEffect(() => {
    if (!receiptId) {
      return;
    }

    try {
      const unsubscribeReceipt = listenForReceipt(receiptId, (receipt) => {
        const receiptItems = receipt.receiptitems || {};
        setSplitPrices(calculateSplits(receiptItems));
      });

      return () => unsubscribeReceipt();
    } catch (err) {
      console.error("Error listening for receipt:", err);
    }
  }, [receiptId]);

  useEffect(() => {
    if (!splitPrices || Object.keys(splitPrices).length === 0) {
      return;
    }

    const createMessage = async () => {
      let message = `Hi friends, I bought this week's groceries! Here is the breakdown:\n`;
      for (const userId in splitPrices) {
        const amount = splitPrices[userId];
        const name = await getUserName(userId);
        message += `\n${name}: $${amount.toFixed(2)}`;
      }
      setMessage(message);
    }

    createMessage();
  }, [splitPrices]);

  async function copyMessage() {
    console.log('Trying to copy Message');
    navigator.clipboard
      .writeText(message)
      .then(() => {
        console.log('Message copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  return (
    <View className="flex-1 items-center">
      <View className="h-full w-full flex-1 items-center">
        <View className="mb-6 mt-8 w-fit gap-2 self-center">
          <Text className="text-1xl text-center font-medium text-white">Scanned Receipt</Text>
        </View>
        <View className="mb-20 w-full flex-grow flex-col items-center justify-center justify-self-center">
          <View className="h-fit w-64 flex-col gap-4 rounded-3xl bg-white p-6">
            <Link href={{ pathname: '/bill', params: { receiptId: receiptId } }} asChild>
              <Pressable className="absolute right-5 top-4 h-fit w-fit items-center justify-center">
                <Feather name="x" size={24} color="black" />
              </Pressable>
            </Link>
            <Text className="mt-2 text-center">Grocery List</Text>
            <Text className="">{message}</Text>
            <Pressable
              className="self-center rounded-lg bg-emerald-900 px-6 py-3 hover:bg-[#3e5636]"
              onPress={copyMessage}
            >
              <Text className="text-sm font-semibold text-white">Copy Message</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
