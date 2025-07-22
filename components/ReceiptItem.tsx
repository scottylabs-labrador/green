// import React, { useState } from 'react';
// import { Text, View, FlatList } from "react-native";
// import { Ionicons } from '@expo/vector-icons';
// import { Link } from "expo-router";

// type ReceiptItemProps = {
//   id: string;
//   name: string;
//   price: number;
//   splits?: string[];
//   colors?: {};
//   matched: boolean;
//   receiptId: string | string[];
// };

// const ReceiptItem = ({ id, name, price, splits, colors, matched, receiptId }: ReceiptItemProps) => {
//   const renderColor = ({ item }) => {
//     try{
//       return (
//         // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
//         <View className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#"+ colors[splits[item]].color}}>
//           <Text className="text-1xl self-center text-center text-white h-fit">{colors[splits[item]].name[0].toUpperCase()}</Text>
//         </View>
//       );
//     }
//     catch{
//       return (
//         // <Text className="flex-1 text-1xl text-left w-1/2 self-center">{colors[item]}</Text>
//         <View className="ml-1 w-7 h-7 rounded-full self-center flex items-center justify-center" style={{ backgroundColor: "#FFFFFF"}}>
//           <Text className="text-1xl self-center text-center text-white h-fit">U</Text>
//         </View>
//       );
//     }
//   }

//   return (
//     <View className={
//       `flex flex-row items-center justify-center w-[90%] h-12 self-center px-2 gap-3 border border-gray-300 rounded-lg`
//       }>
//         <Text className="text-1xl grow text-left w-1/2 self-center">{name}</Text>
//         <View className="flex-row self-center items-center w-fit gap-4 bg-red">
//           {splits ? <FlatList
//                 className="v-full bg-red"
//                 data={Object.keys(splits)}
//                 renderItem={renderColor}
//                 keyExtractor={item => item}
//                 horizontal={true}
//                 contentContainerStyle={{ gap: 1 }}
//                 />
//             : <View></View>}
//         </View>
//         <Text className="text-1xl w-1/8 self-center">${price.toFixed(2)}</Text>
//         <Link href={{
//           pathname: '/unmatched/',
//           params: { itemId: id, receiptId: receiptId },
//           }}>
//           <Ionicons
//             name="pencil"
//             size={16}
//             color="black"
//             className="w-1/8 p-2"/>
//         </Link>
//     </View>
//   )
// }

// export default ReceiptItem

import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import SplitProfile from './SplitProfile';

type ReceiptItemProps = {
  id: string;
  name: string;
  price: number;
  splits?: Record<string, number>;
  colors?: Record<string, { color: string; name: string }>;
  matched: boolean;
  receiptId: string | string[];
};

const ReceiptItem = ({
  id,
  name,
  price,
  splits,
  colors = {},
  matched,
  receiptId,
}: ReceiptItemProps) => {
  // const renderColor = ({ item }: { item: string }) => {
  //   const colorData = colors[splits?.[parseInt(item)] ?? ''];

  //   const bgColor = colorData?.color ? `#${colorData.color}` : '#FFFFFF';
  //   const initial = colorData?.name?.[0]?.toUpperCase() || 'U';

  //   return (
  //     <View
  //       className="ml-1 w-7 h-7 rounded-full items-center justify-center"
  //       style={{ backgroundColor: bgColor }}
  //     >
  //       <Text className="text-xs text-white text-center">{initial}</Text>
  //     </View>
  //   );
  // };

  const renderColor = ({ item }) => {
    return (
      <SplitProfile
        key={item}
        colors={colors}
        item={item}
        size={8}
        fontSize={'1xl'}
        quantity={splits[item]}
      />
    );
  };

  return (
    <View
      className={`h-12 w-[85%] flex-row items-center justify-center self-center rounded-lg border border-gray-300 px-2 ${matched ? 'bg-white' : 'bg-peach'}`}
    >
      <Text className="flex-1 text-black">{name}</Text>

      <View className="max-w-[100px] flex-row items-center space-x-2 self-center">
        {splits ? (
          <FlatList
            data={Object.keys(splits || {})}
            renderItem={renderColor}
            keyExtractor={item => item}
            horizontal
            contentContainerStyle={{
              justifyContent: 'flex-end',
              flexGrow: 1,
              alignItems: 'flex-end',
              paddingHorizontal: 8,
            }}
          />
        ) : null}
      </View>
      <Text className="mx-2 w-12 text-right">${price.toFixed(2)}</Text>
      <Link
        href={{
          pathname: '/unmatched/',
          params: { itemId: id, receiptId },
        }}
        asChild
      >
        <Ionicons name="pencil" size={16} color="black" />
      </Link>
    </View>
  );
};

export default ReceiptItem;
