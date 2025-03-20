<script lang="ts">
  import { goto } from "$app/navigation";

  export let race: App.Race;
  export let bets: App.Bet[] | undefined;

  const dateToDisplay = race.raceStart.toDateString();
  const twoHours = 1000 * 60 * 60 * 2;
  const sixHours = 1000 * 60 * 60 * 6;

  function isRaceUpcoming() {
    const now = new Date();
    return race.raceStart.getTime() - now.getTime() + twoHours > 0;
  }

  function isRaceWithinSixHours() {
    const now = new Date();
    const timeToRace = race.raceStart.getTime() - now.getTime();
    return timeToRace > 0 && timeToRace <= sixHours;
  }

  let isUpcoming = isRaceUpcoming();
  let betPlaced = checkUserBet();

  $: isUrgent = isRaceWithinSixHours() && !betPlaced;

  function checkUserBet() {
    if (!bets) return false;
    return bets.find((bet) => Number(bet.raceId) === Number(race.raceId));
  }

  function goToRace() {
    goto(`/race/${race.raceId}`);
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={goToRace}
  on:keyup={goToRace}
  class="bg-neutral-50 border border-neutral-200 shadow-md rounded-md w-72 h-80 hover:cursor-pointer hover:bg-neutral-200/20 hover:-translate-y-0.5 transition-all ease-in-out duration-300 shrink-0 snap-start {isUrgent
    ? 'relative'
    : ''}"
>
  {#if isUrgent}
    <span class="absolute flex h-3 w-3 -top-1 -right-1">
      <span
        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
      ></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
  {/if}
  <div class="h-3/5">
    <img
      src={race.image}
      alt=""
      class="w-full h-full object-cover rounded-t-md"
    />
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2">
      <img src={race.flag} alt="" class="h-4 rounded-sm shadow-sm" />
      <h3 class="text-lg font-bold">{race.name}</h3>
    </div>
    <p class="text-neutral-500">{race.type}</p>
    <div class="flex justify-between items-center">
      <p class="text-sm mt-4 text-neutral-500">{dateToDisplay}</p>
      {#if isUpcoming && !betPlaced}
        <p
          class="w-fit mt-2 py-1 px-2 bg-gradient-to-r to-30% {isUrgent
            ? 'from-red-300/80 to-red-200 text-red-900'
            : 'from-yellow-300/80 to-yellow-200 text-yellow-900'} rounded-md text-sm"
        >
          {isUrgent ? "Bet soon!" : "Bet not placed"}
        </p>
      {:else if isUpcoming && betPlaced}
        <p
          class="w-fit mt-2 py-1 px-2 bg-gradient-to-r to-30% from-sky-300/70 to-sky-200 text-sky-900 rounded-md text-sm"
        >
          Bet placed
        </p>
      {:else}
        <p
          class="w-fit mt-2 py-1 px-2 bg-gradient-to-r to-30% from-green-300/80 to-green-200 text-green-900 rounded-md text-sm"
        >
          Race finished
        </p>
      {/if}
    </div>
  </div>
</div>
