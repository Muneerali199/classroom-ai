/**
 * AuthContext - Authentication and User Management
 *
 * Provides authentication state management, user profile handling, and session persistence
 * for the Classroom AI application. Integrates with Supabase for backend authentication
 * and AsyncStorage for local session persistence.
 *
 * Features:
 * - User authentication (login/register/logout)
 * - Role-based access control (student/teacher/admin)
 * - Profile management and updates
 * - Onboarding completion tracking
 * - Session persistence across app restarts
 * - Real-time auth state synchronization
 */

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
  ReactNode
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

/**
 * User interface representing a user profile in the system
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** Full display name */
  name: string;
  /** Email address */
  email: string;
  /** User role for access control */
  role: 'student' | 'teacher' | 'admin';
  /** Institution name */
  institution: string;
  /** Optional profile avatar URL */
  avatar?: string;
  /** Optional phone number */
  phone?: string;
  /** Optional date of birth */
  dateOfBirth?: string;
  /** Optional address */
  address?: string;
  /** Optional emergency contact information */
  emergencyContact?: string;
  /** Whether user has completed onboarding */
  hasCompletedOnboarding?: boolean;
  /** Extended profile information */
  profile?: {
    /** User role (redundant with main role field) */
    role: 'student' | 'teacher' | 'admin';
    /** Department or faculty */
    department?: string;
    /** Student ID number */
    studentId?: string;
    /** Employee ID number */
    employeeId?: string;
    /** Academic year */
    year?: string;
    /** Current semester */
    semester?: string;
    /** Academic specialization */
    specialization?: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  institution: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<boolean>;
  isLoading: boolean;
  setStoredUser: (user: User | null) => Promise<void>;
  getStoredUser: () => Promise<User | null>;
  completeOnboarding: () => Promise<void>;
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profile) {
        const storedUser = await getStoredUser();
        const hasCompletedOnboarding = storedUser?.hasCompletedOnboarding || false;

        return {
          id: (profile as any).id,
          name: (profile as any).full_name || '',
          email: (profile as any).email,
          role: (profile as any).role,
          institution: 'University of Technology', // Default for now
          hasCompletedOnboarding,
          profile: {
            role: (profile as any).role,
            department: (profile as any).role === 'student' ? 'Computer Science' :
                        (profile as any).role === 'teacher' ? 'Mathematics' : 'Engineering',
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then((userProfile) => {
          if (userProfile) {
            setUser(userProfile);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required');
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw new Error(error.message);

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        if (userProfile) {
          setUser(userProfile);
          await setStoredUser(userProfile);
        } else {
          const basicProfile = {
            id: data.user.id,
            name: data.user.email || 'User',
            email: data.user.email || '',
            role: 'student' as const,
            institution: 'University of Technology',
            hasCompletedOnboarding: false,
          };
          setUser(basicProfile);
          await setStoredUser(basicProfile);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
      });

      if (authError) throw new Error(authError.message);

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email.trim(),
            full_name: data.name,
            role: data.role,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          const basicProfile = {
            id: authData.user.id,
            name: data.name,
            email: data.email.trim(),
            role: data.role,
            institution: data.institution,
            hasCompletedOnboarding: false,
          };
          setUser(basicProfile);
          await setStoredUser(basicProfile);
        } else {
          const userProfile = {
            id: authData.user.id,
            name: data.name,
            email: data.email.trim(),
            role: data.role,
            institution: data.institution,
            hasCompletedOnboarding: false,
            profile: {
              role: data.role,
              department: data.role === 'student' ? 'Computer Science' :
                          data.role === 'teacher' ? 'Mathematics' : 'Engineering',
            }
          };
          setUser(userProfile);
          await setStoredUser(userProfile);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);

      setUser(null);
      await setStoredUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updatedUser: User): Promise<boolean> => {
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
  }, []);

  const completeOnboarding = useCallback(async (): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');
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
  }, [user]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading,
      setStoredUser,
      getStoredUser,
      completeOnboarding,
    }),
    [user, isLoading, login, register, logout, updateUser, completeOnboarding]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
