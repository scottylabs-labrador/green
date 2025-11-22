import React from 'react';

import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  buttonLabel: string;
  color?: string;
  hoverColor?: string;
  fontSize?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
};

const CustomButton = ({ buttonLabel, color, hoverColor, fontSize, isLoading, isDisabled, onPress }: ButtonProps) => {
  return (
    <Pressable
      className={`${color ? color : 'bg-emerald-900'} ${(isLoading || isDisabled) && 'bg-opacity-50'} self-center rounded-lg px-6 py-3 mb-4 min-w-[120px] min-h-[50px] justify-center items-center ${isLoading ? '' : (hoverColor ? hoverColor : 'hover:bg-emerald-950')}`}
      onPress={onPress}
      disabled={isLoading || isDisabled}
    >
      {isLoading && <ActivityIndicator color="#fff" className="absolute" />}
      <Text 
        className={`
          ${fontSize ? fontSize : 'text-base'} 
          font-semibold text-white
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {buttonLabel}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
