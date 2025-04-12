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
          <div class="p-1 rounded-md bg-neutral-200/80 min-h-12 min-w-12">
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
            <div class="flex gap-2 text-neutral-500">
              <div class="text-sm flex items-center gap-2">
                <img
                  src={`https://res.cloudinary.com/edmccrea/image/upload/v1740431201/F1/Constructors/${driver.constructorId}.png`}
                  alt=""
                  class="h-3"
                />
                {driver.constructor}
              </div>
              <p class="text-sm">·</p>
              <p class="text-sm">
                {driver.wins}
                {driver.wins === 1 ? "win" : "wins"}
              </p>
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
            <div class="flex gap-2 text-neutral-500">
              <p class="text-sm">
                {constructor.wins}
                {constructor.wins === 1 ? "win" : "wins"}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
