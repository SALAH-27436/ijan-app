// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbiieuncjhyjvyojoczg.supabase.co'; // استبدل هذا برابط مشروعك
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaWlldW5jamh5anZ5b2pvY3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkxNjMsImV4cCI6MjA3MzA4NTE2M30.vYMcieiZr4nlF7yByerIXCmSdQAO2q_0zKBkDJNEASU'; // استبدل هذا بمفتاح anon public

export const supabase = createClient(supabaseUrl, supabaseAnonKey);