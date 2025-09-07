
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#2563EB", "#1CB5E0"]}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <View style={styles.content}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to{"\n"}<Text style={styles.brand}>Classroom AI</Text></Text>
        <Text style={styles.subtitle}>
          Your smart companion for managing courses, attendance, analytics, and more. Let AI help you make learning seamless!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={{ uri: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/online-2025987_1280.png' }}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  logo: {
    width: width * 0.28,
    height: width * 0.28,
    marginBottom: 18,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 38,
  },
  brand: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ef',
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 10,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
  },
  buttonText: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  illustrationContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.25,
    borderRadius: 18,
  },
});

export default OnboardingScreen;
