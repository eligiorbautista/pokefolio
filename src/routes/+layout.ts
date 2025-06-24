// this will run before layout setup
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";

export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }: any) => {
    depends("supabase:auth");

    // Note: Custom cookies handling is deprecated in Supabase browser clients.
    // Supabase now manages cookies automatically, so you don't need to provide a cookies object.
    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },

        // Note: This makes the session always null even successfully logged in.
        // cookies: {
        //     get(key: string) {
        //         // if server, something else
        //         if (!isBrowser) {
        //             return JSON.stringify(data.session);
        //         }

        //         // is we are on the browser, do something
        //         const cookie = parse(document.cookie);
        //         return cookie[key];
        //     },
        //     set() {
        //         // no op
        //     },
        //     remove() {
        //         // no op
        //     }
        // }
    });

    const { data: { session } } = await supabase.auth.getSession();

    // --- Sync profile email with auth email ---
    if (session?.user) {
        const userId = session.user.id;
        const authEmail = session.user.email;
        // Get the profile for this user_id
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('user_id', userId)
            .single();
        if (profile && profile.email !== authEmail) {
            // Update the profile email to match the auth email
            await supabase
                .from('profiles')
                .update({ email: authEmail })
                .eq('user_id', userId);
        }
    }
    // --- End sync logic ---

    return { supabase, session };
}