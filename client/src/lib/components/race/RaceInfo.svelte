<script lang="ts">
  export let race: App.Race;
</script>

<div class="flex flex-col justify-center">
  <div class="flex items-center">
    <img src={race.flag} alt="" class="h-14 mr-4 rounded-sm shadow" />
    <div>
      <h1 class="font-bold text-3xl">{race.name}</h1>
      <p class="text-neutral-500">
        {race.type} &middot; {race.raceStart.toDateString()}
      </p>
    </div>
  </div>

  <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-2">
    <img src={race.trackLayout} alt="" class="mt-4 max-h-40 w-max" />
    <div class="w-full">
      <ul class="text-sm">
        <li class="mb-3">
          <span class="font-bold text-xl">
            {race.location}
          </span>
        </li>
        <li class="mb-2 flex gap-2 items-center text-sm">
          <img src="/icons/clock.svg" alt="" class="w-5 h-5" />
          <span class="text-neutral-500">
            {race.qualifyingStart.toString().substring(0, 10) +
              ", " +
              race.qualifyingStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>
        </li>
        <li class="mb-1 flex gap-2 items-center text-sm">
          <img src="/icons/flag.svg" alt="" class="w-5 h-42" />
          <span class="text-neutral-500">
            {race.raceStart.toString().substring(0, 10) +
              ", " +
              race.raceStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</span
          >
        </li>

        <li class="mt-4">
          <span class="text-neutral-500">{race.track}</span>
        </li>
      </ul>
    </div>
  </div>
</div>
