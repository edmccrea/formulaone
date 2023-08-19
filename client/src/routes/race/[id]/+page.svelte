<script lang="ts">
  import { fade } from "svelte/transition";

  import RaceBet from "$lib/components/race/RaceBet.svelte";
  import RaceInfo from "$lib/components/race/RaceInfo.svelte";

  export let data;
  const race = data.race;
  const user = data.user;
  // const grid = data.grid.grid;
  const result = data.result;
  $: betTable = data.betTable;

  const date = Date.now();
  const raceStartObject = new Date(race.raceStart);
  const raceStartMillis = raceStartObject.getTime();

  function showBet(bet: string, username: string) {
    if (!bet) return "";
    if (raceStartMillis < date || username === user.username) return bet;
    return "****";
  }

  function updateBetTable(e: CustomEvent) {
    const bet = e.detail;
    betTable = betTable.filter((bet) => bet.username !== user.username);
    betTable.push(bet);
  }

  function colorCodeResult(
    betPosition: "first" | "second" | "third",
    result: App.Result,
    bet: App.MappedBet
  ) {
    const resultArray = Object.keys(result)
      .filter((key) => key !== "race_id")
      .map((key) => result[key]);

    const userBet = betTable.find((bet) => bet.username === user.username);
    if (!userBet) return "";
    if (bet.bets[betPosition] === result[betPosition]) {
      return "text-emerald-500";
    } else if (resultArray.includes(bet.bets[betPosition])) {
      return "text-sky-500";
    } else if (!resultArray.includes(bet.bets[betPosition])) {
      return "text-red-500";
    } else {
      return "";
    }
  }
</script>

t
<div
  in:fade
  class="w-full h-full px-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-32 md:mt-28 mb-16 flex flex-col flex-1"
>
  <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
    <div class="bg-neutral-900 p-8 rounded-md">
      <RaceInfo {race} />
    </div>
    <div class="bg-neutral-900 p-8 rounded-md">
      <RaceBet {race} {betTable} {user} on:betSubmitted={updateBetTable} />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 md:cols w-full gap-8 mt-8">
    <div class="bg-neutral-900 p-8 rounded-md col-span-2">
      <div class="overflow-auto">
        {#key betTable}
          <table in:fade>
            <thead class="border-b border-b-gray-400 bg-zinc-900/50">
              <tr class="hover:cursor-default">
                <th class="text-left py-3 px-2 sticky"
                  ><div class="w-24">User</div></th
                >
                <th class="text-left py-3 px-2"
                  ><div class="w-40">First</div></th
                >
                <th class="text-left py-3 px-2"
                  ><div class="w-40">Second</div></th
                >
                <th class="text-left py-3 px-2"
                  ><div class="w-40">Third</div></th
                >
              </tr>
            </thead>
            <tbody>
              {#each betTable as bet}
                <tr
                  class="border-b border-b-gray-600 py-2 hover:bg-zinc-900/30 transition-all ease-in-out duration-300 hover:cursor-default"
                >
                  <td class="py-3 px-2 sticky"><span>{bet.username}</span></td>
                  <td class="py-3 px-2"
                    ><span
                      class={result
                        ? colorCodeResult("first", result, bet)
                        : ""}>{showBet(bet.bets.first, bet.username)}</span
                    ></td
                  >
                  <td class="py-3 px-2"
                    ><span
                      class={result
                        ? colorCodeResult("second", result, bet)
                        : ""}>{showBet(bet.bets.second, bet.username)}</span
                    ></td
                  >
                  <td class="py-3 px-2"
                    ><span
                      class={result
                        ? colorCodeResult("third", result, bet)
                        : ""}>{showBet(bet.bets.third, bet.username)}</span
                    ></td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        {/key}
      </div>
    </div>

    <div class="bg-neutral-900 p-8 rounded-md w-full col-span-1">
      <p>Grid</p>
    </div>
  </div>
</div>
