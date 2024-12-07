import { Text, View } from "react-native";

type GroceryItemProps = {
  name: string;
  quantity: number;
};

const GroceryItem = ({ name, quantity }: GroceryItemProps) => {
  return (
    <View className="flex-row items-stretch justify-center w-[85%] h-12 self-center my-2 px-2 border border-gray-300 rounded-lg">
        <Text className="text-1xl text-left w-1/2 self-center">{name}</Text>
        <Text className="text-1xl text-right w-1/2 self-center">{quantity}</Text>
    </View>
  )
}

export default GroceryItem