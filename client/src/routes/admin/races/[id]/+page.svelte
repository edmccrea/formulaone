<script lang="ts">
  import { fade } from "svelte/transition";

  import Button from "$lib/components/Button.svelte";
  import DateInput from "$lib/components/admin/DateInput.svelte";
  import TextInput from "$lib/components/admin/TextInput.svelte";

  export let data;
  const race = data.race!;
  let successfulUpdate = false;
  let errorMessage = "";

  $: raceName = race.race_name;
  $: raceType = race.race_type;
  $: trackName = race.track_name;
  $: trackLayout = race.track_layout;
  $: imageUrl = race.race_image;
  $: qualifyingDate = race.qualifying_date;
  $: qualifyingTime = race.qualifying_time;
  $: raceDate = race.race_date;
  $: raceTime = race.race_time;
  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = "";
    successfulUpdate = false;
    const res = await fetch("/api/race/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...race,
        race_id: Number(race.race_id),
        race_name: raceName,
        race_type: raceType,
        track_name: trackName,
        race_image: imageUrl,
        track_layout: trackLayout,
        qualifying_date: qualifyingDate,
        qualifying_time: qualifyingTime,
        race_date: raceDate,
        race_time: raceTime,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      successfulUpdate = true;
    } else {
      successfulUpdate = false;
      errorMessage = data;
    }
  }
</script>

<h2 class="text-2xl">{race.race_name}</h2>
<a href="/admin/races" class="underline">Go back</a>
<h3 class="mt-8 mb-4 text-xl">Update race details</h3>
<form action="" class="flex flex-col gap-4 mr-16" on:submit={handleSubmit}>
  <div class="flex gap-4">
    <TextInput label="Race name" bind:value={raceName} />
    <TextInput label="Race type" bind:value={raceType} />
    <TextInput label="Circuit name" bind:value={trackName} />
  </div>

  <div class="flex gap-4 items-end">
    <div class="flex flex-col gap-4">
      {#key imageUrl}
        <img src={imageUrl} alt="" class="w-96 h-56 object-cover rounded-md" />
      {/key}
      <div class="flex flex-col w-96 relative">
        <label
          for="race-image"
          class="text-sm text-neutral-400 absolute bg-[#121212] -top-2.5 left-2 px-2"
          >Race image</label
        >
        <input
          id="race-image"
          type="text"
          bind:value={imageUrl}
          class="bg-transparent border border-neutral-500 rounded-md py-2 px-4 w-full focus:border-neutral-300 transition-all duration-300 ease"
        />
      </div>
    </div>
    <div class="flex flex-col gap-4">
      {#key trackLayout}
        <img src={trackLayout} alt="" class="w-52 h-40 object-fit rounded-md" />
      {/key}
      <div class="flex flex-col w-52 relative">
        <label
          for="track-layout"
          class="text-sm text-neutral-400 absolute bg-[#121212] -top-2.5 left-2 px-2"
          >Track layout</label
        >
        <input
          id="track-layoutk"
          type="text"
          bind:value={trackLayout}
          class="bg-transparent border border-neutral-500 rounded-md py-2 px-4 w-full focus:border-neutral-300 transition-all duration-300 ease"
        />
      </div>
    </div>
  </div>

  <div class="flex gap-4 flex-wrap">
    <DateInput label="Qualifying date" bind:value={qualifyingDate} />
    <TextInput label="Qualifying Time" bind:value={qualifyingTime} />
  </div>
  <div class="flex gap-4 flex-wrap">
    <DateInput label="Race date" bind:value={raceDate} />
    <TextInput label="Race Time" bind:value={raceTime} />
  </div>
  {#if successfulUpdate}
    <div
      class="bg-green-200 rounded-t-sm mb-2 flex items-center pl-2 pr-4 py-2 border-l-4 border-l-green-700 w-fit"
      transition:fade
    >
      <svg
        class="mr-2"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="#059669"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p class="text-green-700">Successful update</p>
    </div>
  {/if}
  {#if errorMessage}
    <div
      class="bg-red-200 rounded-t-sm mb-2 flex items-center pl-2 pr-4 py-2 border-l-4 border-l-red-700 w-fit"
      in:fade
    >
      <svg
        class="mr-2"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#b91c1c"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p class="text-red-700">{errorMessage}</p>
    </div>
  {/if}
  <Button type="submit">Update</Button>
</form>
