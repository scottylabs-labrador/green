
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function Page() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);
  const [receiptLines, setReceiptLines] = useState([]);

  let RECEIPT_API_URL = 'http://127.0.0.1:8000/receiptLines';

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
        console.log(response);
        // receipt lines
        response.json();
      }
      );
      // .then((data) => {
      //   console.log(data);
      //   setReceiptLines(data)
      // });
    }
  }


  return (
    <View style={styles.container}>
      {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 500, height: 500 }} /> :
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>}
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
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});


// import { Button, Text, TouchableOpacity, View } from "react-native";
// import React, { useState, useEffect } from 'react';

// import { Camera } from 'expo-camera';
// import { CameraType } from "expo-camera/build/legacy/Camera.types";

// export default function Page() {
//     const [type, setType] = useState(CameraType.back);
//     const [permission, requestPermission] = Camera.useCameraPermissions();
//     const [camera, setCamera] = useState(null);

//     const [receiptLines, setReceiptLines] = useState([]);

//     let RECEIPT_API_URL = 'http://127.0.0.1:8000/receiptLines';

//     // if (!permission) ...

//     // if (!permission.granted) ...

//     function toggleCameraType() {
//       setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
//     }

//     function takePicture() {
//       if (camera) {
//         camera.takePictureAsync({onPictureSaved: (data) => {
//           fetch(RECEIPT_API_URL, {
//             method: 'POST',
//             mode: 'cors',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               "image": data.base64
//             }),
//           }).then((response) =>
//             // receipt lines
//             response.json()
//           ).then((data) => {
//             console.log(data);
//             setReceiptLines(data)
//           });
//         }});
//       }

//     }

//     return (
//     <View className="flex-1 justify-center">
//         <Camera className="flex-1" type={type} ref={(ref) => {setCamera(ref);}}>
//           <View className="flex-1 flex-row bg-transparent m-64">
//               <Button title="Take Picture" onPress={takePicture}/>
//               <TouchableOpacity className="flex-1 self-end items-center" onPress={toggleCameraType}>
//               <Text className="text-2xl font-bold text-white">Flip Camera</Text>
//               </TouchableOpacity>
//           </View>
//         </Camera>
//     </View>
//     );
// }