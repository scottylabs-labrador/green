import React, { useEffect, useState } from 'react';

import type { Members, Splits } from '@db/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, ListRenderItemInfo, Modal, Pressable, Text, View } from 'react-native';

import Button from './CustomButton';

type EditSplitProps = {
  colors: Members;
  splits: Splits,
  visible: boolean;
  onClose: () => void;
  onSplitsChange: (newSplits: Splits) => void;
};

const EditSplit = ({ colors, splits, visible, onClose, onSplitsChange }: EditSplitProps) => {
  const [newSplits, setNewSplits] = useState(splits || {});

  const inSplitStyle = 'outline outline-emerald-900 outline-offset-1';

  useEffect(() => {
    setNewSplits(splits);
  }, [splits]);

  const toggleSplit = (id: string) => {
    if (newSplits && Object.keys(newSplits).includes(id)) {
      const { [id]: _, ...rest } = newSplits;
      setNewSplits(rest);
    } else if (newSplits) {
      setNewSplits(prev => ({
        ...prev, 
        [id]: 1,
      }));
    } else {
      setNewSplits({
        [id]: 1,
      });
    }
  };

  const updateSplitQuantity = (id: string, change: number) => {
    if (newSplits && Object.keys(newSplits).includes(id)) {
      if (newSplits[id] + change > 0) {
        setNewSplits(prev => ({
          ...prev, 
          [id]: prev[id] + change,
        }))
      }
      else {
        const { [id]: _, ...rest } = newSplits;
        setNewSplits(rest);
      }
    }
  }

  const renderProfileButton = ({ item }: ListRenderItemInfo<string>) => {
    const inSplit = newSplits && Object.keys(newSplits).includes(item);
    const name = colors[item].name;

    return (
      <View className="flex-row justify-between items-center p-2">
        <Pressable 
          className="flex-row items-center gap-3"
          onPress={() => toggleSplit(item)}
        >
          <View
            className={`flex h-10 w-10 items-center justify-center self-center rounded-full ${inSplit && inSplitStyle}`}
            style={{ backgroundColor: colors[item].color, opacity: inSplit ? 1 : 0.5 }}
          >
            <Text className="w-1/2 self-center text-center text-white font-medium">
              {colors[item].name[0].toUpperCase()}
            </Text>
          </View>

          <Text className={`${inSplit ? 'text-black' : 'text-gray-500'}`}>{name}</Text>
        </Pressable>

        {inSplit && 
          <View className="ml-4 flex-row items-center space-x-1 self-center">
            <Pressable
              className="justify-center"
              onPress={() => {updateSplitQuantity(item, -1)}}
            >
              <Ionicons name="remove-circle" size={20} color="#164e2d" />
            </Pressable>
            <Text className="text-center">{newSplits[item]}</Text>
            <Pressable
              className="justify-center"
              onPress={() => {updateSplitQuantity(item, 1)}}
            >
              <Ionicons name="add-circle" size={20} color="#164e2d" />
            </Pressable>
          </View>
        }
      </View>
    );
  };

  const saveChanges = () => {
    onSplitsChange(newSplits);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="relative w-[85%] max-h-[50%] rounded-2xl bg-white p-5 shadow-md">
          <Ionicons
            name="close"
            size={24}
            onPress={onClose}
            className="absolute right-3 top-3"
          />
          <Text className="text-center text-lg font-medium">Edit Split</Text>

          <Text className="mt-3 mb-2 text-gray-500 px-2">Tap a profile to add or remove a housemate from the split.</Text>

          <FlatList
            className="my-2 px-2"
            data={Object.keys(colors)}
            renderItem={renderProfileButton}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 10 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          />

          <Button buttonLabel="Save Changes" onPress={saveChanges} fontSize="text-sm" />
        </View>
      </View>
    </Modal>
  );
};

export default EditSplit;
