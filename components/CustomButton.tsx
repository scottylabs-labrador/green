import React from 'react';

import { Pressable, Text } from 'react-native';

type ButtonProps = {
  buttonLabel: string;
  color?: string;
  hoverColor?: string;
  fontSize?: string;
  onPress?: () => void;
};

const CustomButton = ({ buttonLabel, color, hoverColor, fontSize, onPress }: ButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      className={`${color ? color : 'bg-emerald-900'} self-center rounded-lg px-6 py-3 ${hoverColor ? hoverColor : 'hover:bg-emerald-950'} mb-4`}
      onPress={onPress}
    >
      <Text className={`${fontSize ? fontSize : 'text-lg'} font-semibold text-white`}>
        {buttonLabel}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
