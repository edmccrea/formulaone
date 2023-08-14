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
  <div>
    <img src={race.trackLayout} alt="" class="mt-4 h-40 w-auto" />
  </div>
</div>
