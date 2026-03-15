import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are not set
// This allows the app to load without crashing
const isDevelopment = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id');

// Use placeholder values if not configured
const url = isDevelopment ? 'https://placeholder.supabase.co' : supabaseUrl;
const key = isDevelopment ? 'placeholder-key' : supabaseAnonKey;

export const supabase = createClient(url, key);
export const isSupabaseConfigured = !isDevelopment;
