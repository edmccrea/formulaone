<script lang="ts">
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";
  import { Select } from "bits-ui";

  import { drivers as driversStore } from "../../../stores/drivers";
  import Button from "../Button.svelte";
  import { createEventDispatcher } from "svelte";
  import { toast } from "svelte-sonner";
  import { user as userStore } from "../../../stores/user";
  import { invalidateAll } from "$app/navigation";
  import { flyAndScale } from "$lib/utils/transitions";

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

  $: firstSelect = {
    name: "",
    value: "",
  };

  $: secondSelect = {
    name: "",
    value: "",
  };

  $: thirdSelect = {
    name: "",
    value: "",
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

    firstSelect = {
      name: userBets.bets.first,
      value: userBets.bets.first,
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
        userId: Number(user?.userId),
        avatar: user?.avatar,
        bets: {
          first: selection.first,
          second: selection.second,
          third: selection.third,
        },
      });

      const data = await res.json();
      $userStore?.userBets.push(data.insertedBet);
      await invalidateAll();
    }
  }

  function handleEditBet() {
    betSubmitted = false;
    selection = {
      first: "",
      second: "",
      third: "",
    };
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
      <Select.Root
        items={drivers}
        selected={firstSelect}
        onSelectedChange={(selected) => {
          selected && (selection.first = selected.value);
        }}
      >
        <Select.Trigger
          class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none flex justify-between"
          aria-label="First"
        >
          <Select.Value
            class="block text-left text-neutral-500"
            placeholder="First"
          />
          <img src="/chevron-down.svg" alt="" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-xl border border-muted px-1 py-3 shadow-sm outline-none bg-neutral-50 overflow-y-auto"
          transition={flyAndScale}
          sideOffset={8}
          fitViewport={true}
        >
          {#each drivers as driver}
            {#if driver.name !== selection.second && driver.name !== selection.third}
              <Select.Item
                class="flex h-10 w-full select-none items-center rounded-md py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 data-[highlighted]:bg-red-100"
                value={driver.value}
                label={driver.name}
              >
                {driver.name}
                <Select.ItemIndicator class="ml-auto" asChild={false}
                ></Select.ItemIndicator>
              </Select.Item>
            {/if}
          {/each}
        </Select.Content>
        <Select.Input name="first" />
      </Select.Root>

      <Select.Root
        items={drivers}
        selected={secondSelect}
        onSelectedChange={(selected) => {
          selected && (selection.second = selected.value);
        }}
      >
        <Select.Trigger
          class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none flex justify-between"
          aria-label="Second"
        >
          <Select.Value
            class="block text-left text-neutral-500"
            placeholder="Second"
          />
          <img src="/chevron-down.svg" alt="" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-xl border border-muted px-1 py-3 shadow-sm outline-none bg-neutral-50 overflow-y-auto"
          transition={flyAndScale}
          sideOffset={8}
          fitViewport={true}
        >
          {#each drivers as driver}
            {#if driver.name !== selection.first && driver.name !== selection.third}
              <Select.Item
                class="flex h-10 w-full select-none items-center rounded-md py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 data-[highlighted]:bg-red-100"
                value={driver.value}
                label={driver.name}
              >
                {driver.name}
                <Select.ItemIndicator class="ml-auto" asChild={false}
                ></Select.ItemIndicator>
              </Select.Item>
            {/if}
          {/each}
        </Select.Content>
        <Select.Input name="second" />
      </Select.Root>

      <Select.Root
        items={drivers}
        selected={thirdSelect}
        onSelectedChange={(selected) => {
          selected && (selection.third = selected.value);
        }}
      >
        <Select.Trigger
          class="bg-inherit border border-gray-400 rounded-md py-2 px-4 shadow-inner hover:cursor-pointer hover:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none flex justify-between"
          aria-label="Third"
        >
          <Select.Value
            class="block text-left text-neutral-500"
            placeholder="Third"
          />
          <img src="/chevron-down.svg" alt="" />
        </Select.Trigger>
        <Select.Content
          class="w-full rounded-xl border border-muted px-1 py-3 shadow-sm outline-none bg-neutral-50 overflow-y-auto"
          transition={flyAndScale}
          sideOffset={8}
          fitViewport={true}
        >
          {#each drivers as driver}
            {#if driver.name !== selection.second && driver.name !== selection.first}
              <Select.Item
                class="flex h-10 w-full select-none items-center rounded-md py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 data-[highlighted]:bg-red-100"
                value={driver.value}
                label={driver.name}
              >
                {driver.name}
                <Select.ItemIndicator class="ml-auto" asChild={false}
                ></Select.ItemIndicator>
              </Select.Item>
            {/if}
          {/each}
        </Select.Content>
        <Select.Input name="third" />
      </Select.Root>

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
