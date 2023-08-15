<script lang="ts">
  export let race: App.Race;

  const raceStart = new Date(race.raceStart).toString();
  const raceStartString = raceStart.slice(0, 21);
  const qualyStart = new Date(race.qualyStart).toString();
  const qualyStartString = qualyStart.slice(0, 21);
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
    <img src={race.trackLayout} alt="" class="mt-4 h-40 w-auto" />
    <div class="w-full">
      <ul class="text-sm">
        <li class="mb-1">
          <span class="font-bold">Location:</span>
          {race.location}
        </li>
        <li class="mb-1">
          <span class="font-bold">Qualy Start:</span>
          {qualyStartString}
        </li>
        <li class="mb-1">
          <span class="font-bold">Race Start:</span>
          {raceStartString}
        </li>
      </ul>
    </div>
  </div>
</div>
