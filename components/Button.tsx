import { Text, Pressable } from 'react-native';

type ButtonProps = {
  buttonLabel: string;
};

const Button = ({ buttonLabel }: ButtonProps) => {
  return (
    <Pressable 
        className="bg-gray-500 hover:bg-gray-600 mt-4 mb-2 py-2.5 px-4 w-1/3 self-center rounded-lg"
        >
        <Text className="text-white text-center self-center">{buttonLabel}</Text>
    </Pressable>
  )
}

export default Button