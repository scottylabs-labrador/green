import React from 'react';
import { Text, View, TouchableOpacity, TextInput, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import LinkButton from "../../components/LinkButton";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getGroceryListId } from "../../api/grocerylist";
import "../../main.css";
import background from "../../assets/home-background.png";

export default function Home() {
  // TODO: Home page
  // Should this exist for users who
  const router = useRouter();
  const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          getGroceryListId()
            .then(groceryListId => 
              router.replace(
                {pathname: '/list', 
                params: { grocerylist: groceryListId }
                }));
        }
      });
  return (
    <KeyboardAvoidingView className={`flex-1 w-full padding-24`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ImageBackground 
      source={background}
      resizeMode="cover"
      className="bg-dark-green h-full w-full">
      <View className="flex-1 items-center justify-center p-6 h-full w-full">
        <View className="flex justify-center items-center max-w-lg gap-6 h-fit">
          <View>
            <Text className="text-4xl font-bold text-center text-sunflower">Welcome to</Text>
            <Text className="text-7xl font-bold text-center text-sunflower">Green</Text>
          </View>
          <View className="w-full flex flex-col items-center">
            <LinkButton buttonLabel="Sign Up" page="/signup" color="bg-sunflower-70" hoverColor="hover:bg-dark-sunflower-70" />
            <LinkButton buttonLabel="Login" page="/login" color="bg-sunflower-70" hoverColor="hover:bg-dark-sunflower-70" />
          </View>
        </View>
      </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
}