import React, { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChanged, User } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';

import { auth } from '../api/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return subscriber;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
