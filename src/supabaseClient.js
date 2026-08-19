import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rldmoznevfnigfxarqea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZG1vem5ldmZuaWdmeGFycWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTAwODMsImV4cCI6MjEwMjcyNjA4M30.yh1RZos2i3cpntWQttRPS_GhVwCzaT-9u_ssaCQ6Kew';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);