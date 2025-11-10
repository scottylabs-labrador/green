import React from 'react';

import type { HousemateId, Members } from '@db/types';
import { Text, View } from 'react-native';

type SplitProfileProps = {
  colors: Members,
  housemateId: HousemateId,
  size: number,
  fontSize: string,
  quantity: number,
}

const SplitProfile = ({ colors, housemateId, size, fontSize, quantity }: SplitProfileProps) => {
  try {
    return (
      <View className="overflow-visible">
        <View
          className={`ml-1 flex items-center justify-center self-center rounded-full`}
          style={{ backgroundColor: colors[housemateId].color, width: size * 4, height: size * 4 }}
        >
          <Text className={`text-${fontSize} h-fit self-center text-center font-medium text-white`}>
            {colors[housemateId].name[0].toUpperCase()}
          </Text>
        </View>
        <View
          className={`absolute -bottom-0 -right-1 h-4 w-4 items-center justify-center rounded-full bg-emerald-950`}
        >
          <Text className={`text-center text-xs text-white`}>{quantity}</Text>
        </View>
      </View>
    );
  } catch {
    return (
      <View
        className={`ml-1 w-${size} h-${size} flex items-center justify-center self-center rounded-full`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <Text className={`text-${fontSize} h-fit self-center text-center text-white`}>U</Text>
      </View>
    );
  }
};

export default SplitProfile;
