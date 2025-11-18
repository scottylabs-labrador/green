import React from 'react';

import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

type LinkButtonProps = {
  buttonLabel: string;
  page: string;
  color?: string;
  hoverColor?: string;
  fontSize?: string;
  isDisabled?: boolean;
};

const LinkButton = ({ buttonLabel, page, color, hoverColor, fontSize, isDisabled }: LinkButtonProps) => {
  return (
    <Pressable
      className={`${color ? color : 'bg-emerald-900'} ${isDisabled && 'bg-opacity-50'} self-center rounded-lg px-6 py-3 min-w-[120px] min-h-[50px] ${hoverColor ? hoverColor : 'hover:bg-emerald-950'} mb-4`}
    >
      <Link href={page} className="flex items-center justify-center">
        <Text className={`font-semibold text-white ${fontSize ? fontSize : 'text-base'}`}>
          {buttonLabel}
        </Text>
      </Link>
    </Pressable>
  );
};

export default LinkButton;
