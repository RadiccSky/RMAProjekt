
import { createClient } from '@supabase/supabase-js';

// Zamijeni ovo sa svojim detaljima
const SUPABASE_URL = 'https://ajbjhjntennljthfdhqz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYmpoam50ZW5ubGp0aGZkaHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODkwOTQsImV4cCI6MjA1Mjg2NTA5NH0.EU2ttkngep2iz7asCfo8rsUeraiP6CovROm_zw0OcOM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
