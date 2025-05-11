import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oeftabdbkwfycakwakdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZnRhYmRia3dmeWNha3dha2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjU3MTEsImV4cCI6MjA2MjUwMTcxMX0.klGK6EAJt_WWguB64oeCs_7bKtRVQQmlgvxY18fofxA";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
);