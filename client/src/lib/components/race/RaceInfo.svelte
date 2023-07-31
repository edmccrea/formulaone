<script lang="ts">
  export let race: App.Race;
</script>

<div class="flex items-center">
  <img src={race.flag} alt="" class="h-14 mr-4" />
  <div>
    <h1 class="font-bold text-3xl">{race.name}</h1>
    <p>{race.type}</p>
  </div>
</div>
