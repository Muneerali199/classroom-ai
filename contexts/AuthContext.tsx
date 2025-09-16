import { useState, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'dean';
  institution: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  hasCompletedOnboarding?: boolean;
  profile?: {
    role: 'student' | 'teacher' | 'dean';
    department?: string;
    studentId?: string;
    employeeId?: string;
    year?: string;
    semester?: string;
    specialization?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<boolean>;
  isLoading: boolean;
  setStoredUser: (user: User | null) => Promise<void>;
  getStoredUser: () => Promise<User | null>;
  completeOnboarding: () => Promise<void>;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'student@university.edu',
    role: 'student',
    institution: 'University of Technology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2002-05-15',
    address: '123 Student Ave, Campus City, ST 12345',
    emergencyContact: '+1 (555) 987-6543',
    hasCompletedOnboarding: false,
    profile: {
      role: 'student',
      department: 'Computer Science',
      studentId: 'CS2024001',
      year: '3rd Year',
      semester: 'Fall 2024',
      specialization: 'Software Engineering',
    },
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'teacher@university.edu',
    role: 'teacher',
    institution: 'University of Technology',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1985-08-22',
    address: '456 Faculty St, Campus City, ST 12345',
    emergencyContact: '+1 (555) 876-5432',
    hasCompletedOnboarding: false,
    profile: {
      role: 'teacher',
      department: 'Mathematics',
      employeeId: 'MATH001',
      specialization: 'Applied Mathematics',
    },
  },
  {
    id: '3',
    name: 'Prof. Michael Davis',
    email: 'dean@university.edu',
    role: 'dean',
    institution: 'University of Technology',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1975-12-10',
    address: '789 Admin Blvd, Campus City, ST 12345',
    emergencyContact: '+1 (555) 765-4321',
    hasCompletedOnboarding: false,
    profile: {
      role: 'dean',
      department: 'Engineering',
      employeeId: 'DEAN001',
      specialization: 'Academic Administration',
    },
  },
];

// Storage utilities
const STORAGE_KEY = 'user';

const setStoredUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error storing user:', error);
    throw new Error('Failed to store user data');
  }
};

const getStoredUser = async (): Promise<User | null> => {
  try {
    const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error loading stored user:', error);
    return null;
  }
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredUser = async () => {
    try {
      setIsLoading(true);
      const storedUser = await getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required');
    }

    try {
      setIsLoading(true);
      const foundUser = mockUsers.find(u => u.email === email.trim());
      
      if (foundUser && password === 'password') {
        const userWithOnboarding = { ...foundUser, hasCompletedOnboarding: false };
        setUser(userWithOnboarding);
        await setStoredUser(userWithOnboarding);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      await setStoredUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      setIsLoading(true);
      setUser(updatedUser);
      await setStoredUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      setIsLoading(true);
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      await setStoredUser(updatedUser);
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw new Error('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    isLoading,
    setStoredUser,
    getStoredUser,
    completeOnboarding,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};