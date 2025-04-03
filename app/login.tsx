import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView  } from "react-native";
import BackButton from '../components/BackButton';
import { userSignIn } from "../api/firebase";
import { getDatabase, ref, set, push, onValue, get, update } from "firebase/database";
import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import Button from "../components/CustomButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";

async function handleSubmit(email: string, password: string) {
  try {
    await userSignIn(email, password);

    return "";
  } catch (error) {
    return "Invalid email or password.";
  }
}

async function getgrocerylist(filteredemail) {
  
}

export default function Login() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorText, onChangeErrorText] = useState("");
  const router = useRouter();
  const db = getDatabase();
  
  const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user signed in: ", user);
        window.location.href = "/list";
      }
    });

  return (
    <KeyboardAvoidingView className="flex-1 w-full padding-24" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="h-full">
        <View className="flex-1 justify-center w-9/12 max-w-6xl mx-auto mt-32">
          <Text className="mb-9 text-4xl justify-left font-semibold">Login</Text>
          <Text className="mb-2">Email</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangeEmail}
            value={email}
          />
          <Text className="mb-2">Password</Text>
          <TextInput
            className="block bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 align-middle"
            onChangeText={onChangePassword}
            secureTextEntry={true}
            value={password}
          />
          <Text className="text-red-500">{errorText}</Text>
          <Button buttonLabel="Login" onPress={async () => {
            // writeUserData(name, email, phoneNumber);
            const result = await handleSubmit(email, password);

            if (result === "") {
              // router.push("/choosehouse");
              var emailparts = email.split(".");
              var filteredemail = emailparts[0]+":"+emailparts[1];
              // const grocerylist = await getgrocerylist(filteredemail);
              try {
                const itemRef = ref(db, 'housemates/'+filteredemail);
                var houses;
                onValue(itemRef, (snapshot) => {
                    try{
                        const data = snapshot.val();
                        houses = data.houses[0];
                    }
                    catch{
                      console.log("Here 1");
                      router.push("/choosehouse");
                      // return new Promise("");
                    }
                });
                const houseRef = ref(db, 'houses/'+houses)
                onValue(houseRef, (snapshot) => {
                  try{
                    const data = snapshot.val();
                    var grocerylist = data.grocerylist;
                    console.log("yayayaya");
                    console.log(houses);
                    console.log(data);
                    console.log(grocerylist);
                    // router.push("/list?grocerylist="+grocerylist);
                    window.location.href ='/list?grocerylist='+grocerylist;
                    // return grocerylist;
                  }
                  catch{
                    console.log("Here 2");
                    console.log(houseRef);
                    console.log(houses);
                    const dbnew = getDatabase();
                    const houseRefNew = ref(dbnew, 'houses/'+houses)
                    onValue(houseRefNew, (snapshot) => {
                      try{
                        const data = snapshot.val();
                        var grocerylist = data.grocerylist;
                        console.log(grocerylist);
                        window.location.href ='/list?grocerylist='+grocerylist;
                      }
                      catch{
                        router.push("/choosehouse");
                      }
                    });
                    // return "";
                  }
              });
              return "";
              } catch (error) {
                console.log("Error");
                router.push("/choosehouse");
                // return "";
              }
              // console.log("grocerylist found");
              // console.log(grocerylist);
              // if (grocerylist===""){
              //   console.log("grocerylist found");
              //   console.log(grocerylist);
              //   router.push("/choosehouse");
              // }
              // else{
              //   console.log("grocerylist found");
              //   console.log(grocerylist);
              //   router.push("/list"+grocerylist);
              // }
            } else {
              onChangeErrorText(result);
            }
          }}>
        </Button>
        </View>
        <BackButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
