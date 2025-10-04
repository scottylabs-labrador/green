import React, { useEffect, useRef, useState } from 'react';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { onAuthChange } from '../../api/auth';
import { getCurrentUser } from '../../api/firebase';
import { matchWords, writeReceipt } from '../../api/receipt';

export default function Page() {
  const [email, setEmail] = useState('');
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const [receiptLines, setReceiptLines] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const [groceryItemObjects, setGroceryItemObjects] = useState([]);
  const [houseCode, setHouseCode] = useState('');
  const db = getDatabase();
  const router = useRouter();

  let RECEIPT_API_URL = 'http://127.0.0.1:8000/receiptLines';

  type groceryListType = {
    name: String;
    quantity: number;
    splits: String[];
  };

  useEffect(() => {
    const getGroceryList = onAuthChange(user => {
      if (user) {
        let email = getCurrentUser().email;
        var emailParts = email.split('.');
        var filteredEmail = emailParts[0] + ':' + emailParts[1];
        const dbRef = ref(db);
        get(child(dbRef, `housemates/${filteredEmail}`))
          .then(snapshot => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for house:" + data.houses[0].toString());
              let houses = data.houses[0].toString();
              setHouseCode(houses);
              const houseRef = child(dbRef, `houses/${houses}`);
              return get(houseRef);
            } else {
              console.log('failed to get houses');
              return Promise.reject('no house found');
            }
          })
          .then(snapshot => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for grocery lists:" + data.grocerylist);
              let groceryList = data.grocerylist;
              const itemRef = child(dbRef, `grocerylists/${groceryList}`);
              return get(itemRef);
            } else {
              console.log('failed to get grocery list');
              return Promise.reject('no grocery list');
            }
          })
          .then(snapshot => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for list items:" + JSON.stringify(data.groceryitems));
              let items = [];
              let itemObjects = [];
              for (const [_, value] of Object.entries(data.groceryitems)) {
                items.push((value as groceryListType).name);
                itemObjects.push(value as groceryListType);
              }
              console.log('grocery items:', items);
              setGroceryItems(items);
              setGroceryItemObjects(itemObjects);
            } else {
              console.log('failed to get grocery items');
            }
          });
      } else {
        console.log('no user');
        window.location.href = '/login'; // Redirect if not logged in
      }
    });
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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
      setImageUri(photo.uri);

      fetch(RECEIPT_API_URL, {
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
          let receiptLines = JSON.parse(data).items;
          let receiptItems = matchWords(
            getCurrentUser().email,
            receiptLines,
            groceryItems,
            groceryItemObjects,
          );
          console.log(receiptItems);
          const receiptId = window.crypto.randomUUID();
          await writeReceipt(receiptId, houseCode, receiptItems);
          router.replace({
            pathname: '/bill',
            params: { receiptId: receiptId },
          });
        });
      // .then((receipt) => {

      // })
    }
  }

  return (
    <View className="h-full w-full flex-1 justify-center">
      {imageUri ? (
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      ) : (
        <View className="h-full w-full">
          <CameraView ref={cameraRef} className="flex-1" facing={facing}>
            <View className="m-6 flex-1 flex-row justify-center">
              <Text className="font-medium text-white">
                Make sure receipt is flat and lighting is good
              </Text>
            </View>
          </CameraView>
          <View className="absolute bottom-0 left-0 w-full flex-row items-center justify-center px-2 py-4">
            <View className="h-16 w-16"></View>
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                className="h-16 w-16 rounded-full bg-white shadow-lg"
                onPress={takePicture}
              ></TouchableOpacity>
            </View>
            <View className="flex h-16 w-16 items-center justify-center">
              <TouchableOpacity
                className="h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg"
                onPress={toggleCameraFacing}
              >
                <FontAwesome6 name="arrows-rotate" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    // borderRadius: '50%'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
