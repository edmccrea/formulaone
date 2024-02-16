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
    // goto("/login");
    goto("/regsiter");
  };
</script>

<nav
  class="w-full py-6 border-b border-b-gray-400 fixed backdrop-blur-md bg-[#121212]/60 z-50 flex justify-between px-8"
>
  <a href="/" class="flex items-center">
    <img src="/f1.png" alt="" class="h-6" /></a
  >
  <form
    action="/logout"
    method="POST"
    class="flex gap-4 items-center"
    use:enhance={submitLogout}
  >
    <Button type="submit">Logout</Button>
  </form>
</nav>
