// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://scvagkaxpgabyysrrrbj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjdmFna2F4cGdhYnl5c3JycmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjMxNzUsImV4cCI6MjA2MDI5OTE3NX0.RwNqxHZPXknXxlMYAvHY6HYx4VH_yJbBK1ucPt1npLI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);