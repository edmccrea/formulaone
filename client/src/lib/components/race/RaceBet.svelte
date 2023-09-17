<script lang="ts">
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";

  import { drivers as driversStore } from "../../../stores/drivers";
  import Button from "../Button.svelte";
  import { createEventDispatcher } from "svelte";

  export let race: App.Race;
  export let betTable: App.BetTable;
  export let user: App.User;
  export let raceStart: number;

  const dispatch = createEventDispatcher();

  const date = Date.now();
  const drivers = get(driversStore);

  let selection = {
    first: "",
    second: "",
    third: "",
  };

  let betSubmitted = false;
  const userBets = betTable.find((bet) => bet.username === user.username);
  if (userBets?.bets.first && userBets?.bets.second && userBets?.bets.third) {
    betSubmitted = true;
    selection = {
      first: userBets.bets.first,
      second: userBets.bets.second,
      third: userBets.bets.third,
    };
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!selection.first || !selection.second || !selection.third) {
      return;
    }
    betSubmitted = true;

    const res = await fetch("/api/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        race_id: Number(race.id),
        user_id: Number(user.user_id),
        first: selection.first,
        second: selection.second,
        third: selection.third,
      }),
    });

    if (res.ok) {
      dispatch("betSubmitted", {
        username: user.username,
        user_id: user.user_id,
        avatar: user.avatar,
        bets: {
          first: selection.first,
          second: selection.second,
          third: selection.third,
        },
      });
    }
  }

  function handleEditBet() {
    betSubmitted = false;
  }
</script>

<h3 class="mb-4">{betSubmitted ? "Your bet" : "Place your bet"}</h3>

{#if betSubmitted}
  <div class="flex flex-col gap-2">
    <p class="text-xl">1. {selection.first}</p>
    <p class="text-xl">2. {selection.second}</p>
    <p class="text-xl">3. {selection.third}</p>
    {#if raceStart > date}
      <Button type="button" on:click={handleEditBet}>Change bet</Button>
    {/if}
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

    {#if selection.first && selection.second && selection.third}
      {#if raceStart < date}
        <div in:fade={{ duration: 200 }}>
          <p>Sorry, this race has already taken place.</p>
        </div>
      {:else}
        <div in:fade={{ duration: 200 }}>
          <Button type="submit">Place bet</Button>
        </div>
      {/if}
    {/if}
  </form>
{/if}
