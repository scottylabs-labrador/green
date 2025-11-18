import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

type SecureTextInputProps = {
  value: string;
  onChangeText: (newValue: string) => void;
  className?: string;
};

const SecureTextInput = ({ value, onChangeText, className }: SecureTextInputProps) => {
  const [seeValue, setSeeValue] = useState(false);

  const combinedClassName = twMerge(
    'flex flex-row justify-center items-center mb-2 w-full rounded-lg border border-gray-300 bg-gray-50',
    className
  );

  return (
    <View className={combinedClassName}>
      <TextInput
        className="w-full p-2.5 text-sm text-gray-900 rounded-lg"
        onChangeText={onChangeText}
        secureTextEntry={!seeValue}
        value={value}
      />
      <TouchableOpacity
        className="w-fit px-3"
        onPress={() => setSeeValue(!seeValue)}
      >
        <Ionicons name={seeValue ? 'eye' : 'eye-off'} size={18} color="lightgray" />
      </TouchableOpacity>
    </View>
  );
};

export default SecureTextInput;
