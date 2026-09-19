import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
  supabaseFetch,
} from "@/lib/supabase/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n’est pas configuré.");
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: { fetch: supabaseFetch },
  });
}
