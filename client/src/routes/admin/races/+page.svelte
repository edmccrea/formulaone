<script lang="ts">
  export let data;
  const races = data.races;
</script>

<div class="pr-16">
  <h2 class="text-2xl">Races</h2>

  <div class="pt-4">
    {#each races as race}
      <div
        class="border-b border-neutral-500 hover:cursor-pointer hover:bg-neutral-700/50 transition-all duration-300 ease-in-out py-2 px-4"
      >
        <a
          href={`/admin/races/${race.race_id}`}
          class="w-full flex items-center gap-4"
        >
          <img src={race.country_flag} alt="" class="h-8 rounded-md" />
          <p class="w-56">{race.race_name}</p>
          <p>{race.race_type}</p>
        </a>
      </div>
    {/each}
  </div>
</div>
