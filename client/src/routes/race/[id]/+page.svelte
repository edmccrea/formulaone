<script lang="ts">
  import { fade } from "svelte/transition";

  import RaceBet from "$lib/components/race/RaceBet.svelte";
  import RaceInfo from "$lib/components/race/RaceInfo.svelte";

  export let data;
  const race = data.race;
  const betTable = data.betTable;
  const user = data.user;

  const date = Date.now();
  const raceStartObject = new Date(race.raceStart);
  const raceStartMillis = raceStartObject.getTime();

  function showBet(bet: string, username: string) {
    if (!bet) return "";
    if (raceStartMillis > date || username === user.username) return bet;
    return "****";
  }
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-28 flex flex-col flex-1"
>
  <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
    <div class="bg-neutral-900 p-8 rounded-md">
      <RaceInfo {race} />
    </div>
    <div class="bg-neutral-900 p-8 rounded-md">
      <RaceBet />
    </div>
  </div>

  <div>
    <h2 class="text-2xl font-bold mt-8">Bets</h2>
    <div class="bg-neutral-900 p-8 rounded-md">
      <table>
        <thead class="border-b border-b-gray-400 bg-zinc-900/50">
          <tr>
            <th class="text-left py-3 px-2">User</th>
            <th class="text-left py-3 px-2">First</th>
            <th class="text-left py-3 px-2">Second</th>
            <th class="text-left py-3 px-2">Third</th>
          </tr>
        </thead>
        <tbody>
          {#each betTable as bet}
            <tr
              class="border-b border-b-gray-600 py-2 hover:bg-zinc-900/30 transition-all ease-in-out duration-300 hover:cursor-default"
            >
              <td class="py-3 px-2">{bet.username}</td>
              <td class="py-3 px-2">{showBet(bet.bets.first, bet.username)}</td>
              <td class="py-3 px-2">{showBet(bet.bets.second, bet.username)}</td
              >
              <td class="py-3 px-2">{showBet(bet.bets.third, bet.username)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
