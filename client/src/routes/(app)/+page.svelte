<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import RaceCard from "$lib/components/race/RaceCard.svelte";
  import Leaderboard from "$lib/components/Leaderboard.svelte";
  import { handleIntersection } from "$lib/utils/handle-intersection";
  import Button from "$lib/components/Button.svelte";
  import type { PageData } from "./$types";
  import { user } from "../../stores/user";
  import WelcomeMessage from "$lib/components/WelcomeMessage.svelte";

  export let data: PageData;
  const users: App.User[] = data.users;
  const previousRaces: App.Race[] = data.previousRaces;
  const upcomingRaces: App.Race[] = data.upcomingRaces;
  const date = Date.now();

  let animationElements: HTMLElement[] = [];

  function elRef(node: HTMLElement) {
    if (node) {
      animationElements = [...animationElements, node];
    }
  }

  onMount(() => {
    animationElements.forEach((element) => {
      const observer = new IntersectionObserver(handleIntersection);
      observer.observe(element);
    });
  });
</script>

<div
  in:fade
  class="w-full h-full px-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-28 mb-12 flex flex-col flex-1"
>
  <h1 class="text-5xl lg:text-7xl font-bold mb-4 font-gradient">
    Formula One Bets
  </h1>
  <WelcomeMessage session={data.session} />

  {#if $user?.admin}
    <a href="/admin" class="mt-4">
      <Button>Admin Panel</Button>
    </a>
  {/if}

  <div class="flex flex-col lg:flex-row lg:gap-8">
    <div
      class="mt-8 lg:order-2 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit w-full overflow-hidden"
    >
      <h2 class="font-bold text-2xl mb-4">Upcoming Race</h2>
      <!-- If race is this week, then display a countdown -->
      {#if upcomingRaces.length > 0}
        <RaceCard race={upcomingRaces[0]} bets={$user?.userBets} />
      {:else}
        <p>The season has ended!</p>
      {/if}
    </div>

    <div
      class="mt-8 lg:order-1 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit w-full"
    >
      <h2 class="font-bold text-2xl mb-4">Leaderboard</h2>
      <Leaderboard {users} />
    </div>
  </div>

  <div
    class="animate-on-visible mt-8 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit"
    use:elRef
  >
    <!-- <div class="mt-8 animate-on-visible" use:elRef> -->
    <h2 class="font-bold text-2xl">Future Races</h2>
    <div
      class="flex py-4 gap-4 w-full relative overflow-auto snap-x lg:snap-none overflow-y-hidden"
    >
      {#if upcomingRaces.length > 0}
        {#each upcomingRaces as race}
          <RaceCard {race} bets={$user?.userBets} />
        {/each}
      {:else}
        <p>There are no upcoming races.</p>
      {/if}
    </div>
  </div>

  <div
    class="animate-on-visible mt-8 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit"
    use:elRef
  >
    <h2 class="font-bold text-2xl">Previous Races</h2>
    <div
      class="flex py-4 gap-4 w-full relative overflow-auto snap-x lg:snap-none overflow-y-hidden"
    >
      {#if previousRaces.length > 0}
        {#each previousRaces as race}
          {#if race.raceStart.getTime() < date}
            <RaceCard {race} bets={$user?.userBets} />
          {/if}
        {/each}
      {:else}
        <p>There are no previous races.</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .font-gradient {
    background: linear-gradient(
      40deg,
      rgb(240, 81, 81) 34%,
      rgb(126, 82, 82) 89%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
