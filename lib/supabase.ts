import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase Client with Service Role (Safe for server-side auth bypassing RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);
