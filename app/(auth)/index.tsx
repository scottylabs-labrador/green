import '../../main.css';

import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { ImageBackground, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import LinkButton from '@/components/LinkButton';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user?.uid) {
          return;
        }
  
        const houseId = await getHouseId(user.uid);
  
        if (!houseId) {
          router.push('/choosehouse');
          return;
        }
  
        const groceryListId = await getGroceryListIdFromHouse(houseId);
        if (groceryListId) {
          router.push({ pathname: '/list', params: { grocerylist: groceryListId } });
        } else {
          router.push('/choosehouse');
        }
      } catch (err) {
        console.log('Error while redirecting:', err);
        router.push('/choosehouse');
      }
    }

    checkUser();
  }, [user]);

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
                buttonLabel="Log In"
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
