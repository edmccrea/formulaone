<script lang="ts">
  import type { Session } from "@supabase/supabase-js";
  import { user } from "../../stores/user";
  import Button from "./Button.svelte";

  export let session: Session | null;

  function getPositionSuffix(position: number) {
    switch (position) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const positionSuffix = $user ? getPositionSuffix($user.position) : "";
</script>

<p class="text-xl">
  Hello {$user?.username ?? session?.user.email} 👋,
  {#if $user}
    you're currently in {$user.position}{positionSuffix}
    place with <span class="font-bold">{$user.points}</span>
    points.
  {:else}
    You need to create a profile!
    <a href="/profile/create">
      <Button>Create a profile</Button>
    </a>
  {/if}
</p>
