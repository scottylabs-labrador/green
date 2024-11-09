import { Text, Pressable } from "react-native";
import { Link } from "expo-router";

type LinkButtonProps = {
  buttonLabel: string;
  page: string;
};

const LinkButton = ({ buttonLabel, page }: LinkButtonProps) => {
  return (
    <Pressable 
        className="flex justify-items-center items-center bg-gray-500 hover:bg-gray-600 w-1/3 h-fit self-center rounded-lg"
        >
        <Link href={page} className="flex justify-center items-center py-2.5 px-4 w-full h-full">
          <Text className="text-white text-center self-center justify-items-center">{buttonLabel}</Text>
        </Link>
    </Pressable>
  )
}

export default LinkButton