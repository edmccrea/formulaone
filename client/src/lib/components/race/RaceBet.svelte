<script lang="ts">
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";

  import { drivers as driversStore } from "../../../stores/drivers";
  import Button from "../Button.svelte";
  import { createEventDispatcher } from "svelte";
  import { toast } from "svelte-sonner";
  import { user as userStore } from "../../../stores/user";

  export let race: App.Race;
  export let betTable: App.BetTable;
  export let user: App.User | null;
  export let raceStart: number;
  export let seasonId: number;

  const dispatch = createEventDispatcher();

  const date = Date.now();
  const drivers = get(driversStore);

  let selection = {
    first: "",
    second: "",
    third: "",
  };

  let betSubmitted = false;
  const userBets = betTable.find((bet) => bet.username === user?.username);
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
        raceId: Number(race.raceId),
        userId: Number(user?.userId),
        seasonId: Number(seasonId),
        first: selection.first,
        second: selection.second,
        third: selection.third,
      }),
    });

    if (res.ok) {
      toast.success("Bet placed");
      dispatch("betSubmitted", {
        username: user?.username,
        userId: user?.userId,
        avatar: user?.avatar,
        bets: {
          first: selection.first,
          second: selection.second,
          third: selection.third,
        },
      });

      const data = await res.json();
      $userStore?.userBets.push(data.insertedBet);
    }
  }

  function handleEditBet() {
    betSubmitted = false;
  }
</script>

{#if !user}
  <div class="flex flex-col gap-2">
    <p class="text-lg">
      You need to create a profile in order to be able to place a bet
    </p>
    <a href="/profile/create" class="text-base">
      <Button>Create a profile</Button>
    </a>
  </div>
{:else}
  <h3 class="mb-2 text-neutral-500">
    {betSubmitted ? "Your bet" : "Place your bet"}
  </h3>

  {#if betSubmitted}
    <ol
      class="flex flex-col gap-2 mb-4 p-4 rounded-md border border-red-700/20 shadow-sm"
    >
      <li class="text-xl">
        <span class="text-xs text-neutral-500">1.</span>
        {selection.first}
      </li>
      <li class="text-xl">
        <span class="text-xs text-neutral-500">2.</span>
        {selection.second}
      </li>
      <li class="text-xl">
        <span class="text-xs text-neutral-500">3.</span>
        {selection.third}
      </li>
    </ol>
    {#if raceStart > date}
      <Button type="button" on:click={handleEditBet}>Change bet</Button>
    {/if}
  {:else}
    <form action="" on:submit={handleSubmit} class="flex flex-col gap-3">
      <select
        name=""
        id="driver-one"
        bind:value={selection.first}
        class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none"
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
        class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none"
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
        class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none"
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
{/if}

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("/chevron-down.svg");
    background-repeat: no-repeat;
    background-position: calc(100% - 1rem) center;
    background-size: 1em;
  }
</style>
