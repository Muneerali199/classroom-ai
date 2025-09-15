import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check if user has seen onboarding before
    const hasSeenOnboarding = false;
    
    if (!user && !hasSeenOnboarding) {
      setShowOnboarding(true);
      router.replace('/Onboarding' as any);
    } else if (user) {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/Auth' as any);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Return empty view while routing happens
  return <View style={{ flex: 1, backgroundColor: '#2563EB' }} />;
}