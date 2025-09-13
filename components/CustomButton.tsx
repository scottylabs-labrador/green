import React from 'react';
import { Text, Pressable } from 'react-native';

type ButtonProps = {
  buttonLabel: string;
  onPress?: () => void; // Optional onPress prop
};

const CustomButton = ({ buttonLabel, onPress }: ButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(); // Execute custom logic if provided
    }
  };

  return (
    <Pressable
      className="mb-4 self-center rounded-lg bg-emerald-900 px-6 py-3 hover:bg-emerald-950"
      onPress={handlePress}
    >
      <Text className="text-lg font-semibold text-white">{buttonLabel}</Text>
    </Pressable>
  );
};

export default CustomButton;
