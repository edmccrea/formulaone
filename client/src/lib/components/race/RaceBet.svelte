<script lang="ts">
  import { get } from "svelte/store";

  import { drivers as driversStore } from "../../../stores/drivers";
  import Button from "../Button.svelte";

  export let raceStart: string;

  const date = Date.now();
  const raceStartObject = new Date(raceStart);
  const raceStartMillis = raceStartObject.getTime();

  const drivers = get(driversStore);

  let selection = {
    first: "",
    second: "",
    third: "",
  };

  let betSubmitted = false;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!selection.first || !selection.second || !selection.third) {
      return;
    }
    betSubmitted = true;
    console.log(selection);

    const res = await fetch("/api/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first: selection.first,
        second: selection.second,
        third: selection.third,
      }),
    });
  }

  function handleEditBet() {
    betSubmitted = false;
  }
</script>

<h3 class="mb-4">{betSubmitted ? "Your bet" : "Place your bet"}</h3>

{#if betSubmitted}
  <div class="flex flex-col gap-2">
    <p>1. {selection.first}</p>
    <p>2. {selection.second}</p>
    <p>3. {selection.third}</p>
    <Button type="button" on:click={handleEditBet}>Change bet</Button>
  </div>
{:else}
  <form action="" on:submit={handleSubmit} class="flex flex-col gap-3">
    <select
      name=""
      id="driver-one"
      bind:value={selection.first}
      class="bg-inherit border border-zinc-500 rounded-md py-2 px-4 hover:cursor-pointer hover:border-zinc-400 transition-all ease-in-out duration-300 focus:outline-none"
    >
      <option value="">First</option>
      {#each drivers as driver}
        {#if driver.name !== selection.second && driver.name !== selection.third}
          <option value={driver.name}>{driver.name}</option>
        {/if}
      {/each}
    </select>
    <select
      name=""
      id="driver-one"
      bind:value={selection.second}
      class="bg-inherit border border-zinc-500 rounded-md py-2 px-4 hover:cursor-pointer hover:border-zinc-400 transition-all ease-in-out duration-300 focus:outline-none"
    >
      <option value="">Second</option>
      {#each drivers as driver}
        {#if driver.name !== selection.first && driver.name !== selection.third}
          <option value={driver.name}>{driver.name}</option>
        {/if}
      {/each}
    </select>
    <select
      name=""
      id="driver-one"
      bind:value={selection.third}
      class="bg-inherit border border-zinc-500 rounded-md py-2 px-4 hover:cursor-pointer hover:border-zinc-400 transition-all ease-in-out duration-300 focus:outline-none"
    >
      <option value="">Third</option>
      {#each drivers as driver}
        {#if driver.name !== selection.first && driver.name !== selection.second}
          <option value={driver.name}>{driver.name}</option>
        {/if}
      {/each}
    </select>

    <Button type="submit" disabled={raceStartMillis < date}>Place bet</Button>
  </form>
{/if}
