import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

export interface OptionItem {
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

type ListOptionsProps = {
  options: OptionItem[];
};

export const ListOptions = ({ options }: ListOptionsProps) => {
  return (
    <Menu>
      <MenuTrigger customStyles={{ triggerWrapper: { padding: 4 } }}>
        <Ionicons name="ellipsis-vertical" size={20} color="white" />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 8,
            padding: 5,
            width: 200,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          },
        }}
      >
        {options.map((option, index) => (
          <MenuOption
            key={index}
            onSelect={option.onPress}
            customStyles={{
              optionWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                marginVertical: 2,
                borderRadius: 4,
              },
              optionText: {
                marginLeft: 10,
                fontSize: 16,
                color: '#333',
              },
            }}
          >
            {option.icon}
            <Text 
              className="ml-2 text-red-500 font-semibold"
              style={{ color: option.color }}
            >
              {option.label}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};
