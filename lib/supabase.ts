import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

const supabaseUrl = "https://vdpwbhouavsizhorslco.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkcHdiaG91YXZzaXpob3JzbGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NjgzMjUsImV4cCI6MjAyODQ0NDMyNX0.2cGeW_77xcmju236HSjkVlLozjyxIGLdgQpWyn9DQLI"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})