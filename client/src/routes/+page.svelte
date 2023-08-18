<script lang="ts">
  import { fade } from "svelte/transition";

  import RaceCard from "$lib/components/race/RaceCard.svelte";
  import Leaderboard from "$lib/components/Leaderboard.svelte";

  export let data;
  const user: App.User = data.user;
  const users: App.User[] = data.users;
  const bets: App.Bet[] = data.bets;
  const previousRaces: App.Race[] = data.previousRaces;
  const upcomingRaces: App.Race[] = data.upcomingRaces;
  const positionSuffix =
    user.position === 1
      ? "st"
      : user.position === 2
      ? "nd"
      : user.position === 3
      ? "rd"
      : "th";

  const date = Date.now();
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-28 mb-12 flex flex-col flex-1"
>
  <h1 class="text-5xl font-bold mb-4">Formula One Bets 2023</h1>
  <p>
    Hello {user.username}, you're currently in {user.position}{positionSuffix} place
    with {user.points}
    points.
  </p>

  <div class="mt-8">
    <h2 class="font-bold text-2xl mb-4">Upcoming Race</h2>
    <!-- If race is this week, then display a countdown -->
    {#if upcomingRaces.length > 0}
      <RaceCard race={upcomingRaces[0]} {bets} />
    {:else}
      <p>The season has ended!</p>
    {/if}
  </div>

  <div class="mt-8">
    <h2 class="font-bold text-2xl mb-4">Leaderboard</h2>
    <Leaderboard {users} />
  </div>

  <div class="mt-8">
    <h2 class="font-bold text-2xl mb-4">Future Races</h2>
    <div class="flex gap-4 w-full relative overflow-auto snap-x">
      {#if upcomingRaces.length > 0}
        {#each upcomingRaces as race}
          {#if new Date(race.raceStart).getTime() > date}
            <RaceCard {race} {bets} />
          {/if}
        {/each}
      {:else}
        <p>There are no upcoming races.</p>
      {/if}
    </div>
  </div>

  <div class="mt-8">
    <h2 class="font-bold text-2xl mb-4">Previous Races</h2>
    <div class="flex gap-4 w-full relative overflow-auto">
      {#if previousRaces.length > 0}
        {#each previousRaces as race}
          {#if new Date(race.raceStart).getTime() < date}
            <RaceCard {race} {bets} />
          {/if}
        {/each}
      {:else}
        <p>There are no previous races.</p>
      {/if}
    </div>
  </div>
</div>
