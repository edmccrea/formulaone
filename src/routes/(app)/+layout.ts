import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    supabase,
    session,
    previousRaces: data.previousRaces,
    upcomingRaces: data.upcomingRaces,
    allRaces: data.allRaces,
    users: data.users,
    bets: data.bets,
    currentSeason: data.currentSeason,
    user: data.user,
    userBets: data.userBets,
  };
}) satisfies LayoutLoad;
