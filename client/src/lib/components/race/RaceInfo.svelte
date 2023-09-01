<script lang="ts">
  export let race: App.Race;
  export let qualyStartDateObject: Date;
  export let raceStartDateObject: Date;
</script>

<div class="flex flex-col justify-center">
  <div class="flex">
    <img src={race.flag} alt="" class="h-14 mr-4" />
    <div>
      <h1 class="font-bold text-3xl">{race.name}</h1>
      <p>{race.type} &middot; {raceStartDateObject.toDateString()}</p>
    </div>
  </div>

  <div class="flex flex-col lg:flex-row gap-4 mt-2">
    <img src={race.trackLayout} alt="" class="mt-4 max-h-40 w-max" />
    <!-- <p class="text-xs">{race.track}</p> -->
    <div class="w-full">
      <ul class="text-sm">
        <li class="mb-1">
          <span class="font-bold text-xl">
            {race.location}
          </span>
        </li>
        <li class="mb-1">
          <span class="text-lg">
            ⏱️: {qualyStartDateObject.toString().substring(0, 21)}
          </span>
        </li>
        <li class="mb-1">
          <span class="text-lg"
            >🏎️: {raceStartDateObject.toString().substring(0, 21)}</span
          >
        </li>
        <li class="mt-4">
          <span>{race.track}</span>
        </li>
      </ul>
    </div>
  </div>
</div>
