import { createBrowserClient } from "@supabase/ssr";

// Standard public/anonymous client for general client-side use
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Creates a client-side Supabase client with the Clerk JWT token.
 * This should be used inside React components or hooks where you have access to the session.
 * @param clerkToken The JWT token obtained from Clerk (e.g., via getToken({ template: 'supabase' }))
 */
export function createClerkSupabaseClient(clerkToken?: string) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: clerkToken ? `Bearer ${clerkToken}` : "",
        },
      },
    }
  );
}
