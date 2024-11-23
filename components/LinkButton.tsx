import { Text, Pressable } from "react-native";
import { Link } from "expo-router";

type LinkButtonProps = {
  buttonLabel: string;
  page: string;
};

const LinkButton = ({ buttonLabel, page }: LinkButtonProps) => {
  return (
    <Pressable className="bg-gray-500 rounded-lg py-3 px-6 self-center hover:bg-gray-600 mb-4">
      <Link href={page} className="flex items-center justify-center">
        <Text className="text-white text-lg font-semibold">{buttonLabel}</Text>
      </Link>
    </Pressable>
  )
}

export default LinkButton