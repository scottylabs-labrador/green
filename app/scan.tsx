
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState, useEffect } from 'react';
import { onAuthChange } from "../api/auth";
import { getCurrentUser } from "../api/firebase";
import { getDatabase, ref, set, push, onValue, get, remove, child } from "firebase/database";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { matchWords } from '../api/receipt';

export default function Page() {
  const [email, setEmail] = useState("");
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const [receiptLines, setReceiptLines] = useState([]);
  const [groceryItems, setGroceryItems] = useState([]);
  const db = getDatabase();

  let RECEIPT_API_URL = 'http://127.0.0.1:8000/receiptLines';

  type groceryListType = {
    name: String,
    quantity: number,
    splits: String[]
  }

  useEffect(() => {
    const getGroceryList = onAuthChange((user) => {
      if (user) {
        let email = getCurrentUser().email;
        var emailParts = email.split(".");
        var filteredEmail = emailParts[0] + ":" + emailParts[1];
        const dbRef = ref(db);
        get(child(dbRef, `housemates/${filteredEmail}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for house:" + data.houses[0].toString());
              let houses = data.houses[0].toString();
              const houseRef = child(dbRef, `houses/${houses}`);
              return get(houseRef);
            }
            else {
              console.log("failed to get houses");
              return Promise.reject("no house found");
            }
          })
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for grocery lists:" + data.grocerylist);
              let groceryList = data.grocerylist;
              const itemRef = child(dbRef, `grocerylists/${groceryList}`);
              return get(itemRef);
            }
            else {
              console.log("failed to get grocery list");
              return Promise.reject("no grocery list")
            }
          })
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              // console.log("data for list items:" + JSON.stringify(data.groceryitems));
              let items = [];
              for (const [_, value] of Object.entries(data.groceryitems)) {
                items.push((value as groceryListType).name);
              }
              console.log("grocery items:", items);
              setGroceryItems(items);
            }
            else {
              console.log("failed to get grocery items");
            }
          });
      }
      else {
        console.log("no user");
        window.location.href = "/login"; // Redirect if not logged in
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
          "image": photo.base64
        }),
      }).then((response) => {
        // receipt lines
        return response.json()
      }).then((data) => {
        console.log("data:", data);
        setReceiptLines(data);
      });
    }
  }

  return (
    <View className="w-full h-full flex-1 justify-center">
      {imageUri ? <Image source={{ uri: imageUri }} className="w-full h-full" /> :
        <View className="h-full w-full">
          <CameraView ref={cameraRef} className="flex-1" facing={facing}>
            <View className="flex-1 flex-row m-6 justify-center">
              <Text className="text-white font-medium">Make sure receipt is flat and lighting is good</Text>
            </View>
          </CameraView>
          <View className="absolute bottom-0 left-0 w-full flex-row items-center justify-center px-2 py-4">
            <View className="w-16 h-16"></View>
            <View className="flex-1 justify-center items-center">
              <TouchableOpacity className='w-16 h-16 rounded-full bg-white shadow-lg' onPress={takePicture}></TouchableOpacity>
            </View>
            <View className="flex justify-center items-center w-16 h-16">
              <TouchableOpacity className='w-14 h-14 rounded-full bg-black shadow-lg justify-center items-center' onPress={toggleCameraFacing}>
                <FontAwesome6 name="arrows-rotate" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>}
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