// import { View } from "react-native";
// import { Stack, Slot } from 'expo-router';
// import React from 'react';

// export default function AuthLayout() {
//   return (
//     <Stack />
//   );
// }

import React from 'react';
import { Stack, Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
    </Stack>
  );
}
