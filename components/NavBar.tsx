import React from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getGroceryListId } from "../api/grocerylist";

type NavBarProps = {
    location: string;
  };

const NavBar = ({ location }: NavBarProps) => {

  // var grocerylisturl = "/list?grocerylist="+grocerylist_id;
  return (
    <View className="justify-center bg-white h-16 w-full fixed bottom-0 items-center m-0">
      <View className="w-3/4 flex-row flex space-x-4 justify-between">
          <Link href={{pathname: "/list"}} asChild>
              <Ionicons
                  name="home" 
                  size={24} 
                  color={location == "profile" ? "gray" : "pink"}/>
          </Link>
          <Link href="/scan" asChild>
              <Ionicons
                  name='camera'
                  size={24}
                  color="gray"/>
          </Link>
          <Link href="/profile" asChild>
              <FontAwesome
                  name='user-circle'
                  size={24}
                  color={location == "profile" ? "pink" : "gray"}/>
          </Link>
      </View>
  </View>
  )
}

export default NavBar