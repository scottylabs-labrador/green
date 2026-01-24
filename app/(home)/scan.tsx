import React, { useEffect, useRef, useState } from 'react';

import { FontAwesome6 } from '@expo/vector-icons';
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { listenForGroceryItems } from '@/api/grocerylist';
import { matchWords, writeReceipt } from '@/api/receipt';
import Button from '@/components/CustomButton';
import LinkButton from '@/components/LinkButton';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';
import { useHouseInfo } from '@/context/HouseContext';
import { GroceryItems } from '@db/types';

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { houseId, groceryListId } = useHouseInfo();
  
  const [userId, setUserId] = useState('');
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<CameraCapturedPicture | null>(null);
  const [photos, setPhotos] = useState<CameraCapturedPicture[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const [groceryItems, setGroceryItems] = useState<GroceryItems>({});
  const [loading, setLoading] = useState(false);

  let RECEIPT_API_URL = 'http://127.0.0.1:8000/receiptLines';

  useEffect(() => {
    const fetchHouseId = async () => {
      try {
        if (user && user.uid) {
          setUserId(user.uid);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        console.error("Error while fetching user ID:", err);
      }
    }

    fetchHouseId();
  }, [user, router]);

  useEffect(() => {
    if (!groceryListId) {
      return;
    }

    const unsubscribeGroceryItems = listenForGroceryItems(groceryListId, (items) => {
      setGroceryItems(items);
    });

    return () => unsubscribeGroceryItems();
  }, [groceryListId]);

  if (!permission) {
    // Camera permissions are still loading.
    return <Loading message="Loading camera permissions..." />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="h-full w-full flex-1 justify-center items-center px-4 bg-gray-50">
        <Text className="text-center pb-6">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} buttonLabel="Grant Permission" fontSize="text-sm" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, exif: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setCurrentPhoto(photo);
      setImageUri(photo.uri);
    }
  }

  async function retakePicture() {
    setCurrentPhoto(null);
    setImageUri(null);
  }

  async function savePicture(){
    if (currentPhoto != null){
      setPhotos([...photos, currentPhoto]);
    }
    setCurrentPhoto(null);
    setImageUri(null);
  }

  async function analyzePicture() {
    setLoading(true);

    var allreceiptLines: any[] = [];
    for (const photo of photos) {
      console.log(photo.base64)
      await fetch(RECEIPT_API_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: photo.base64,
        }),
      })
      .then(response => {
        // receipt lines
        return response.json();
      })
      .then(async data => {
        console.log('data:', data);
        let receiptLines = data.items;
        allreceiptLines = [...allreceiptLines, receiptLines]
        
      });
    }

    const combinedLines = allreceiptLines.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    let receiptItems = matchWords(
      userId,
      combinedLines,
      groceryItems,
    );
    console.log(receiptItems);
    
    try {
      const receiptId = window.crypto.randomUUID();
      await writeReceipt(receiptId, houseId, receiptItems);
      setLoading(false);
      router.replace({
        pathname: '/bill',
        params: { receiptId: receiptId },
      });
    } catch (err) {
      setLoading(false);
      console.error("Error while writing receipt:", err);
    }
  }

  return (
    <View className="h-full w-full flex-1 justify-center">
      {imageUri ? (
        <View className="h-full w-full">
          <Image source={{ uri: imageUri }} className="h-full w-full" />
          <View className="absolute bg-black bottom-0 left-0 w-full flex-row items-center justify-center px-2 py-4 gap-2">
            <View className="flex-1 items-center justify-center">
              <LinkButton
                buttonLabel="Cancel"
                fontSize="text-sm"
                page="/list"
              />
            </View>
            <View className="flex-1 items-center justify-center">
              <Button
                buttonLabel="Retake"
                fontSize="text-sm"
                onPress={retakePicture}
              />
            </View>
            <View className="flex-1 items-center justify-center">
              <Button
                buttonLabel="Continue"
                fontSize="text-sm"
                onPress={savePicture}
              />
            </View>
          </View>
        </View>
      ) : (
        <View className="h-full w-full">
          <CameraView ref={cameraRef} className="flex-1" facing={facing}>
            <View className="m-6 flex-1 flex-row justify-center">
              <Text className="h-fit font-medium text-white">
                Make sure receipt is flat and lighting is good
              </Text>
            </View>
          </CameraView>
          <View className="absolute bottom-20 left-0 w-full flex-row items-center justify-center px-2 py-4">
            <View className="h-16 w-16"></View>
            <View className="flex-1 items-center justify-center"></View>
            <View className="flex h-16 w-16 items-center justify-center">
              <TouchableOpacity
                className="h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg"
                onPress={toggleCameraFacing}
              >
                <FontAwesome6 name="arrows-rotate" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="absolute bg-black bottom-0 left-0 w-full flex-row items-center justify-center px-2 py-4">
            <View className="flex-1 items-center justify-center">
              <LinkButton
                buttonLabel="Cancel"
                fontSize="text-sm"
                page="/list"
              />
            </View>
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                className="h-16 w-16 rounded-full bg-white shadow-lg"
                onPress={takePicture}
              ></TouchableOpacity>
            </View>
            <View className="flex-1 items-center justify-center">
              <Button
                buttonLabel="Finish"
                fontSize="text-sm"
                isLoading={loading}
                onPress={analyzePicture}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
