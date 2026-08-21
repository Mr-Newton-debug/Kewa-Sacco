import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rldmoznevnfigfxarqea.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZG1vem5ldmZuaWdmeGFycWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzE1MDA4MywiZXhwIjoyMTAyNzI2MDgzfQ.YBkYE4c_gyFyxHXw2FGNJDbz4vU5MfrXemfN4ewA4xs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.sessionStorage, // Automatically logs out when the tab or window is closed
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});