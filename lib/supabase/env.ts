/**
 * Public Supabase credentials.
 * Accepts both the current Publishable key (sb_publishable_…)
 * and a legacy JWT anon key.
 */
export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isPublishableApiKey(key: string) {
  return key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
}

/**
 * Publishable keys are not JWTs. They must go in `apikey` only.
 * A user session JWT may still be sent as Authorization Bearer.
 */
export function supabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
  const key = getSupabaseAnonKey();
  if (!isPublishableApiKey(key)) {
    return fetch(input, init);
  }

  const headers = new Headers(init?.headers);
  if (!headers.has("apikey")) {
    headers.set("apikey", key);
  }
  if (headers.get("Authorization") === `Bearer ${key}`) {
    headers.delete("Authorization");
  }
  return fetch(input, { ...init, headers });
}
