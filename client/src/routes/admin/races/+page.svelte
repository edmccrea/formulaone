<script lang="ts">
  import Button from "$lib/components/Button.svelte";

  export let data;
  const races = data.races;
</script>

<div class="pr-16">
  <h2 class="text-2xl">Races</h2>

  <div class="pt-4">
    {#each races as race}
      <div
        class="flex items-center gap-4 border-b border-neutral-500 hover:bg-neutral-800 transition-all duration-300 ease-in-out py-2 px-4 w-fit"
      >
        <img
          src={race.country_flag}
          alt=""
          class="h-8 w-12 object-cover rounded-md"
        />
        <p class="w-56">{race.race_name}</p>
        <p class="w-24">{race.race_type}</p>
        <a href={`/admin/races/${race.race_id}`}>
          <Button>Edit</Button>
        </a>
      </div>
    {/each}
  </div>
</div>
