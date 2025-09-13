import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinkButton from '../../components/LinkButton';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getGroceryListId } from '../../api/grocerylist';
import '../../main.css';
import background from '../../assets/home-background.png';

export default function Home() {
  // TODO: Home page
  // Should this exist for users who
  const router = useRouter();
  const auth = getAuth();
  onAuthStateChanged(auth, async user => {
    if (user) {
      getGroceryListId().then(groceryListId =>
        router.replace({ pathname: '/list', params: { grocerylist: groceryListId } }),
      );
    }
  });
  return (
    <KeyboardAvoidingView
      className={`padding-24 w-full flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={background}
        resizeMode="cover"
        className="h-full w-full bg-dark-green"
      >
        <View className="h-full w-full flex-1 items-center justify-center p-6">
          <View className="flex h-fit max-w-lg items-center justify-center gap-6">
            <View>
              <Text className="text-center text-4xl font-bold text-sunflower">Welcome to</Text>
              <Text className="text-center text-7xl font-bold text-sunflower">Green</Text>
            </View>
            <View className="flex w-full flex-col items-center">
              <LinkButton
                buttonLabel="Sign Up"
                page="/signup"
                color="bg-sunflower-70"
                hoverColor="hover:bg-dark-sunflower-70"
              />
              <LinkButton
                buttonLabel="Login"
                page="/login"
                color="bg-sunflower-70"
                hoverColor="hover:bg-dark-sunflower-70"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
