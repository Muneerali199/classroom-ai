import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

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
    if (user && user.id && user.name && user.email) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error storing user:', error);
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

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoredUser = async () => {
    try {
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
      return false;
    }

    try {
      const foundUser = mockUsers.find(u => u.email === email.trim());
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        await setStoredUser(foundUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await setStoredUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      setUser(updatedUser);
      await setStoredUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    isLoading,
    setStoredUser,
    getStoredUser,
  }), [user, isLoading]);

  return contextValue;
});