import { Text, Pressable } from 'react-native';

type ButtonProps = {
  buttonLabel: string;
  onPress?: () => void; // Optional onPress prop
};


const Button = ({ buttonLabel, onPress }: ButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(); // Execute custom logic if provided
    }
  };

  return (
    <Pressable className="bg-emerald-900 rounded-lg py-3 px-6 self-center hover:bg-emerald-950 mb-4" onPress={handlePress}>
        <Text className="text-white text-lg font-semibold">{buttonLabel}</Text>
    </Pressable>
  )
}

export default Button