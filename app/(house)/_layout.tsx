import { Slot, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    return null;
  }

  return <Slot />;
}
