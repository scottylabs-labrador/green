// import { Slot, Stack } from 'expo-router';
// import React from 'react';

// export default function HouseLayout() {
//   return (
//     <Stack />
//   );
// }

import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait for auth to load

    if (!user) {
      // Redirect unauthenticated users to login
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    // Optionally render splash/loading while waiting for auth
    return null;
  }

  return <Slot />;
}
