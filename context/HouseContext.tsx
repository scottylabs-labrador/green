import React, { createContext, useContext, useEffect, useState } from 'react';


import { getUserEmail } from '@/api/auth';
import { getHouseId, listenForHouseInfo } from '@/api/house';
import Loading from '@/components/Loading';
import { Members } from '@db/types';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

type HouseContextType = {
  houseId: string;
  houseName: string;
  color: string;
  ownerId: string;
  members: Members;
  userEmails: Record<string, string>;
  loading: boolean;
};

const HouseContext = createContext<HouseContextType>({
  houseId: '',
  houseName: '',
  color: '',
  ownerId: '',
  members: {},
  userEmails: {},
  loading: true,
});

export const HouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [houseId, setHouseId] = useState('');
  const [houseName, setHouseName] = useState('');
  const [color, setColor] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [members, setMembers] = useState<Record<string, any>>({});
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchHouseId = async () => {
      if (user && user.uid) {
        setUserId(user.uid);

        try {
          const id = await getHouseId(user.uid);
          setHouseId(id);
        } catch (err) {
          console.error("Error fetching house ID:", err);
        }
      } else {
        router.replace('/login');
      }
    }

    fetchHouseId();
  }, [user]);

  useEffect(() => {
    if (!houseId || !userId) return;

    try {
      const unsubscribe = listenForHouseInfo(houseId, (house) => {
        const members = house.members || {};

        setHouseName(house.name);
        setMembers(members);
        console.log("members", members)

        const userData = members[userId];
        if (userData) {
          setColor(userData.color);
        }

        setOwnerId(house.owner || '');

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error listening for house info:", err);
    }
  }, [houseId, userId]);

  useEffect(() => {
      const fetchEmails = async () => {
        const emails: Record<string, string> = {};
  
        for (const userId of Object.keys(members)) {
          try {
            emails[userId] = await getUserEmail(userId);
          } catch (err) {
            console.error(`Error fetching email for user ${userId}:`, err);
          }
        }
        setUserEmails(emails);
      }
  
      fetchEmails();
    }, [members]);

  return (
    <HouseContext.Provider value={{ houseId, houseName, color, ownerId, members, userEmails, loading }}>
      {loading ? (
        <Loading message="Loading house..."/>
      ) : (
        children
      )}
    </HouseContext.Provider>
  );
};

export const useHouseInfo = () => useContext(HouseContext);
