import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { joinGroupWithInvite } from '../../api/join';
import { getAuth } from 'firebase/auth';
import React from 'react';

export default function JoinPage() {
  const { invite } = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const doJoin = async () => {
      try {
        const userId = getAuth().currentUser?.uid;
        if (!invite || !userId) throw new Error("Missing invite or user");

        const groupId = await joinGroupWithInvite(invite.toString(), userId);
        setStatus('success');
        router.replace(`/group/${groupId}`);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Join failed");
        setStatus('error');
      }
    };

    doJoin();
  }, [invite]);

  if (status === 'loading') {
    return (
      <View>
        <Text>Joining group...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View>
        <Text>Error joining group: {errorMsg}</Text>
      </View>
    );
  }

  return null;
}
