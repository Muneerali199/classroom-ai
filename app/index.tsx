import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const [checkedOnboarding, setCheckedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isLoading) return;

      const seen = await AsyncStorage.getItem('hasSeenOnboarding');

      if (!user && !seen) {
        // First time -> show onboarding
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/Onboarding');
      } else if (user) {
        // User already logged in
        router.replace('/(tabs)');
      } else {
        // No user but onboarding done
        router.replace('/Auth');
      }

      setCheckedOnboarding(true);
    };

    checkOnboarding();
  }, [user, isLoading]);

  if (isLoading || !checkedOnboarding) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2563EB',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <View style={{ flex: 1, backgroundColor: '#2563EB' }} />;
}
