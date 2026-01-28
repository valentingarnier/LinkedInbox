import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Re-export pagination helper for client-side use
export { fetchAllRows } from "./pagination";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
