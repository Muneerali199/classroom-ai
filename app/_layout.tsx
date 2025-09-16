import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle navigation logic
  useEffect(() => {
    if (isLoading) return;

    const inTabs = segments[0] === "(tabs)";
    const inAuth = segments[0] === "Auth";
    const inOnboarding = segments[0] === "Onboarding";
    const inIndex = segments[0] === "index";

    console.log("Navigation state:", { 
      user, 
      segments,
      userOnboarding: user?.hasCompletedOnboarding 
    });

    if (user) {
      // User is logged in but hasn't completed onboarding
      if (!user.hasCompletedOnboarding) {
        // Only redirect to onboarding if we're not already there
        if (!inOnboarding) {
          console.log("Redirecting to Onboarding (user hasn't completed onboarding)");
          router.replace("/Onboarding");
        }
      }
      // User is logged in and has completed onboarding
      else if (user.hasCompletedOnboarding) {
        // Only redirect to tabs if we're not already there and we're in auth/onboarding/index
        if ((inAuth || inOnboarding || inIndex) && !inTabs) {
          console.log("Redirecting to Tabs (user completed onboarding)");
          router.replace("/(tabs)");
        }
      }
    } else {
      // No user logged in, should be in auth
      if (!inAuth && !inOnboarding && !inIndex) {
        console.log("Redirecting to Auth (no user logged in)");
        router.replace("/Auth");
      }
    }
  }, [user, segments, isLoading, router]);

  // Hide splash when everything is ready
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="Auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      {/* Add all your other screens here */}
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider>
          <LocalizationProvider>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}