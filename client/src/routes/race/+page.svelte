<script>
  import { fade } from "svelte/transition";
  import { get } from "svelte/store";

  import { drivers as driversStore } from "../../stores/drivers";

  export let data;
  const race = data.race;
  const drivers = get(driversStore);
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl mt-12 flex flex-col flex-1"
>
  <div class="flex flex-col md:flex-row w-full gap-8">
    <div class="w-1/2 bg-slate-400">
      <div class="flex items-center">
        <img src={race.flag} alt="" class="h-12 mr-4" />
        <h1 class="font-bold text-3xl">{race.name}</h1>
      </div>
    </div>
    <div class="w-1/2 bg-slate-400">
      <form action="">
        <label for="driver-one">First</label>
        <select name="" id="driver-one">
          <option value="">Default</option>
          {#each drivers as driver}
            <option value={driver.name}>{driver.name}</option>
          {/each}
        </select>
      </form>
    </div>
  </div>
</div>
