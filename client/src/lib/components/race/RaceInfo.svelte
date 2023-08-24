<script lang="ts">
  export let race: App.Race;
</script>

<div class="flex flex-col justify-center">
  <div class="flex">
    <img src={race.flag} alt="" class="h-14 mr-4" />
    <div>
      <h1 class="font-bold text-3xl">{race.name}</h1>
      <p>{race.type}</p>
    </div>
  </div>
  <div class="flex flex-col lg:flex-row gap-4">
    <img src={race.trackLayout} alt="" class="mt-4 max-h-40 w-max" />
    <div class="w-full">
      <ul class="text-sm">
        <li class="mb-1">
          <span class="font-bold">Location:</span>
          {race.location}
        </li>
        <li class="mb-1">
          <span class="font-bold">Qualy Start:</span>
          {race.qualyTime.substring(0, 5)}
        </li>
        <li class="mb-1">
          <span class="font-bold">Race Start:</span>
          {race.raceTime.substring(0, 5)}
        </li>
      </ul>
    </div>
  </div>
</div>
