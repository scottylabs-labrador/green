import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';

import { userSignOut, userVerifyEmail } from '@/api/auth';
import { getGroceryListIdFromHouse } from '@/api/grocerylist';
import { getHouseId } from '@/api/house';
import background from '@/assets/home-background.png';
import Button from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import Entypo from '@expo/vector-icons/Entypo';

export default function VerifyEmail() {
  const router = useRouter();
  const { user } = useAuth();

  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      router.replace('/signup');
      return;
    }

    const interval = setInterval(async () => {
      await user.reload();

      if (user.emailVerified) {
        clearInterval(interval);
        try {
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
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    if (!user?.uid || user.emailVerified) return;

    try {
      setLoading(true);
      await userVerifyEmail(user);

      setCooldown(30);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.log("Error when handling forgot password:", err);
      if (err instanceof Error) {
        setErrorText(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = () => {
    try {
      userSignOut();
      router.replace('/signup');
    } catch (err) {
      console.error("Error while signing out in verifyemail:", err);
    }
  }

  return (
    <ImageBackground 
      source={background}
      className={`flex-1 bg-white h-screen w-screen overflow-hidden`}
      imageStyle={{ opacity: 0.5 }}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        className="padding-24 w-full flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="h-full">
          <View className="mx-auto mt-32 w-9/12 max-w-6xl flex-1 justify-center">
            <View className="w-full items-center justify-center mb-5">
              <Entypo name="mail-with-circle" size={96} color="#064e3b" />
            </View>
            <Text className="mb-3 text-3xl text-center font-semibold">Verify your email</Text>

            <Text className="text-gray-500 text-center mb-4">
              Please verify your email address by clicking the link sent to 
            </Text>
            <Text className="font-medium text-center mb-5">
              {user?.email}
            </Text>

            <Text className="mb-4 text-red-500">{errorText}</Text>

            <Button buttonLabel="Resend Verification Email" onPress={handleResendEmail} isLoading={loading} isDisabled={cooldown > 0} />

            <Text className={`text-center mt-2 text-blue-500 font-medium`} onPress={handleSignOut}>
              Back
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
