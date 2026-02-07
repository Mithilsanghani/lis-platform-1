import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    " Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
  );
  // Create a mock client for development
  supabaseClient = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: {}, error: null }),
      signInWithPassword: async () => ({ data: {}, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
    }),
    rpc: async () => ({ data: [], error: null }),
    channel: () => ({
      on: function() { return this; },
      subscribe: () => {},
    }),
  };
}

export const supabase = supabaseClient;
