import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRouter } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'dean';
  institution: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'dean';
  institution: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [storedUser, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('onboarded')
      ]);
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setIsOnboarded(onboardingStatus === 'true');
      
      // Navigate based on auth state
      if (!onboardingStatus) {
        router.replace('/Onboarding' as any);
      } else if (!storedUser) {
        router.replace('/Auth' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your API
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'student',
        institution: 'Demo University'
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        institution: userData.institution
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/Auth' as any);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarded', 'true');
      setIsOnboarded(true);
      router.replace('/Auth' as any);
    } catch (error) {
      console.error('Onboarding completion error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isOnboarded,
      login,
      register,
      logout,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};