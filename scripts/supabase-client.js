// Initialize Supabase client
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Create and initialize the Supabase client
const supabase = window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized:', !!supabase);