<script lang="ts">
  import { goto } from "$app/navigation";

  export let race: App.Race;

  const raceDate = new Date(race.raceStart);
  const dateToDisplay = raceDate.toDateString();

  let isUpcoming = true;
  let betPlaced = race.userHasBet;

  function goToRace() {
    goto(`/race/${race.id}`);
  }
</script>

<div
  on:click={goToRace}
  on:keyup={goToRace}
  class="bg-zinc-900 border border-slate-700 rounded-md w-72 h-80 hover:cursor-pointer hover:bg-zinc-800 transition-all ease-in-out duration-300 shrink-0 snap-start"
>
  <div class="h-3/5">
    <img src={race.image} alt="" class="w-full h-full object-cover" />
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2">
      <img src={race.flag} alt="" class="h-4" />
      <h3 class="text-xl font-bold">{race.name}</h3>
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
          class="w-fit mt-2 py-1 px-2 bg-green-200 text-green-900 rounded-md text-sm"
        >
          Bet placed
        </p>
      {/if}
    </div>
  </div>
</div>
