import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import Constants from 'expo-constants';

const config = Constants.expoConfig;

if (!config || !config.extra) {
  throw new Error('Missing Expo config. Please check your app.json configuration.');
}

const supabaseUrl = config.extra.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = config.extra.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your app.json configuration.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
