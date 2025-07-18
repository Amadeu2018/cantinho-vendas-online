import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bueecgmyuqbfgyftlqcl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZWVjZ215dXFiZmd5ZnRscWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NDQxNDEsImV4cCI6MjA0OTQyMDE0MX0.ahRq6O0-I1blWu25cXHljQhGScX6Stu7NIeT5NI62WA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'my-app-name',
    },
  },
});