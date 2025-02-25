<script lang="ts">
  import { goto } from "$app/navigation";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Button from "./Button.svelte";
  import { enhance } from "$app/forms";
  import type { SupabaseClient } from "@supabase/supabase-js";

  export let supabaseClient: SupabaseClient;

  const submitLogout: SubmitFunction = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error(error);
    }
    goto("/regsiter");
  };
</script>

<nav
  class="w-full py-6 border-b border-b-gray-200 fixed backdrop-blur-md bg-neutral-50/60 z-50 flex justify-between px-8"
>
  <a href="/" class="flex items-center">
    <img src="/logo.png" alt="" class="h-6" /></a
  >
  <div class="flex gap-4 items-center">
    <a href="/standings" class="hover:underline">Standings</a>
    <form
      action="/logout"
      method="POST"
      class="flex gap-4 items-center"
      use:enhance={submitLogout}
    >
      <Button type="submit">Logout</Button>
    </form>
  </div>
</nav>
