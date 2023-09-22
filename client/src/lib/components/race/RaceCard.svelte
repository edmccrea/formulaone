<script lang="ts">
  import { goto } from "$app/navigation";
  import { combineDateTime } from "$lib/utils/combine-date-time";

  export let race: App.Race;
  export let bets: App.Bet[];

  const raceStart = combineDateTime(race.raceDate, race.raceTime);
  const dateToDisplay = raceStart.toDateString();
  const twoHours = 1000 * 60 * 60 * 2;

  function isRaceUpcoming() {
    const now = new Date();
    return raceStart.getTime() - now.getTime() + twoHours > 0;
  }

  let isUpcoming = isRaceUpcoming();
  let betPlaced = checkUserBet();

  function checkUserBet() {
    return bets.find((bet) => bet.race_id === race.id);
  }

  function goToRace() {
    goto(`/race/${race.id}`);
  }
</script>

<div
  on:click={goToRace}
  on:keyup={goToRace}
  class="bg-zinc-900 border border-neutral-700 rounded-md w-72 h-80 hover:cursor-pointer hover:bg-zinc-800 transition-all ease-in-out duration-300 shrink-0 snap-start"
>
  <div class="h-3/5">
    <img
      src={race.image}
      alt=""
      class="w-full h-full object-cover rounded-t-md"
    />
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2">
      <img src={race.flag} alt="" class="h-4 rounded-sm" />
      <h3 class="text-lg font-bold">{race.name}</h3>
    </div>
    <p>{race.type}</p>
    <div class="flex justify-between items-center">
      <p class="text-sm mt-4">{dateToDisplay}</p>
      {#if isUpcoming && !betPlaced}
        <p
          class="w-fit mt-2 py-1 px-2 bg-yellow-200 text-yellow-900 rounded-md text-sm"
        >
          Bet not placed
        </p>
      {:else if isUpcoming && betPlaced}
        <p
          class="w-fit mt-2 py-1 px-2 bg-sky-200 text-sky-900 rounded-md text-sm"
        >
          Bet placed
        </p>
      {:else}
        <p
          class="w-fit mt-2 py-1 px-2 bg-green-200 text-green-900 rounded-md text-sm"
        >
          Race finished
        </p>
      {/if}
    </div>
  </div>
</div>
