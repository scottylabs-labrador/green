import React from 'react';

import { EmailProvider } from '@/context/EmailContext';
import { Slot, Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <EmailProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </EmailProvider>
  );
}
