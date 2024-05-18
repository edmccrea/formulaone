<script lang="ts">
  import type { Session } from "@supabase/supabase-js";
  import { user } from "../../stores/user";
  import Button from "./Button.svelte";
  import { getPositionSuffix } from "../utils/get-position-suffix";

  export let session: Session | null;

  const positionSuffix = $user ? getPositionSuffix($user.position) : "";
</script>

<p class="text-xl">
  Hello {$user?.username ?? session?.user.email} 👋
  {#if $user}
    , you're currently in {$user.position}{positionSuffix}
    place with <span class="font-bold">{$user.points}</span>
    points.
  {:else}
    <div
      class="mt-2 flex flex-col gap-2 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md"
    >
      <p>This year you need to create a profile before we get started</p>

      <a href="/profile/create" class="text-base">
        <Button>Create a profile</Button>
      </a>
    </div>
  {/if}
</p>
