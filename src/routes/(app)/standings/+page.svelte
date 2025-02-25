<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div
  class="grid sm:grid-cols-2 gap-8 mt-24 w-full max-w-5xl mx-auto items-start p-4"
>
  <div
    class="lg:order-2 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit w-full overflow-hidden"
  >
    <h2 class="text-xl font-bold">Drivers Standings</h2>
    <div class="flex flex-col gap-3 mt-4">
      {#each data.driverStandings as driver}
        <div
          class="flex gap-3 border-b border-b-neutral-200 pb-2 last:border-b-0 last:pb-0"
        >
          <div>
            <img src={driver.helmet} alt="" class="h-12" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <p>{driver.driverName}</p>
              <p class="font-semibold">
                {driver.points}<span class="text-xs font-light ml-0.5">
                  pts</span
                >
              </p>
            </div>
            <div class="flex gap-2">
              <p class="text-sm">{driver.constructor}</p>
              <p class="text-sm">·</p>
              <p class="text-sm">{driver.wins} wins</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div
    class="lg:order-2 bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit w-full overflow-hidden"
  >
    <h2 class="text-xl font-bold">Constructors Standings</h2>
    <div class="flex flex-col gap-3 mt-4">
      {#each data.constructorStandings as constructor}
        <div
          class="flex gap-3 border-b border-b-neutral-200 pb-2 last:border-b-0 last:pb-0"
        >
          <div class="w-8 flex justify-center items-center">
            <img
              src={constructor.logo}
              alt=""
              class="h-4 w-auto object-contain"
            />
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <p>{constructor.constructorName}</p>
              <p class="font-semibold">
                {constructor.points}<span class="text-xs font-light ml-0.5">
                  pts</span
                >
              </p>
            </div>
            <div class="flex gap-2">
              <p class="text-sm">{constructor.wins} wins</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
