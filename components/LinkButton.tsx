import React from "react";
import { Text, Pressable } from "react-native";
import { Link } from "expo-router";

type LinkButtonProps = {
  buttonLabel: string;
  page: string;
  color?: string;
  hoverColor?: string;
  fontSize?: string;
};

const LinkButton = ({ buttonLabel, page, color, hoverColor, fontSize }: LinkButtonProps) => {
  return (
    <Pressable className={`${color ? color : "bg-emerald-900"} rounded-lg py-3 px-6 self-center ${hoverColor ? hoverColor : "hover:bg-emerald-950"} mb-4`}>
      <Link href={page} className="flex items-center justify-center">
        <Text className={`text-white font-semibold ${fontSize ? fontSize : "text-lg"}`}>{buttonLabel}</Text>
      </Link>
    </Pressable>
  )
}

export default LinkButton