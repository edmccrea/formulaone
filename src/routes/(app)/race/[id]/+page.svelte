<script lang="ts">
  import { fade } from "svelte/transition";
  import { Confetti } from "svelte-confetti";

  import RaceBet from "$lib/components/race/RaceBet.svelte";
  import RaceInfo from "$lib/components/race/RaceInfo.svelte";
  import CommentSection from "$lib/components/race/CommentSection.svelte";
  import { user as userStore } from "../../../../stores/user";
  import Avatar from "$lib/components/Avatar.svelte";

  export let data;
  const race = data.allRaces.find((race) => race.raceId === data.raceId);
  if (!race) {
    throw new Error("Race not found");
  }
  $: user = $userStore;
  const users = data.users;
  const grid = data.grid;
  const result = data.result;
  const comments = data.comments;
  let betTable: App.BetTable;
  $: {
    if (race && data.bets) {
      betTable = createBetTable(data.users, data.bets);
    }
  }

  const date = Date.now();
  const raceStartMillis = race.raceStart.getTime();

  function showBet(bet: string, username: string) {
    if (!bet) return "";
    if (raceStartMillis < date || username === user?.username) return bet;
    return "****";
  }

  function createBetTable(users: App.User[], bets: App.Bet[]): App.BetTable {
    const betTable: App.BetTable = [];

    users.forEach((user) => {
      betTable.push({
        username: user.username,
        userId: user.userId,
        avatar: user.avatar,
        position: user.position,
        points: user.points,
        constructorBet: user.constructorBet,
        bets: {
          first: "",
          second: "",
          third: "",
        },
      });
    });

    bets.forEach((bet) => {
      const user = betTable.find(
        (user) => Number(user.userId) === Number(bet.userId),
      );
      if (user && Number(race?.raceId) === Number(bet.raceId))
        user.bets = {
          first: bet.first,
          second: bet.second,
          third: bet.third,
        };
    });
    return betTable;
  }

  function updateBetTable(e: CustomEvent) {
    const bet = e.detail;
    betTable = betTable.filter((bet) => bet.username !== user?.username);
    betTable.push(bet);
  }

  function colorCodeResult(
    betPosition: "first" | "second" | "third",
    result: App.Result,
    bet: App.MappedBet,
  ) {
    const resultArray = Object.keys(result)
      .filter((key) => key !== "raceId")
      .map((key) => result[key as keyof App.Result]);

    const userBet = betTable.find((bet) => bet.username === user?.username);
    if (!userBet) return "";
    if (bet.bets[betPosition] === result[betPosition]) {
      return "text-emerald-600";
    } else if (resultArray.includes(bet.bets[betPosition])) {
      return "text-sky-600";
    } else if (!resultArray.includes(bet.bets[betPosition])) {
      return "text-red-600";
    } else {
      return "";
    }
  }

  function checkRacePoints() {
    if (!betTable) return false;
    const userBets = betTable.find((bet) => bet.username === user?.username);
    if (!userBets) return false;
    if (
      result &&
      userBets.bets.first === result.first &&
      userBets.bets.second === result.second &&
      userBets.bets.third === result.third
    ) {
      return true;
    } else {
      return false;
    }
  }
  $: isMaxPoints = betTable && checkRacePoints();
</script>

{#if isMaxPoints}
  <div
    class="fixed -top-12 left-0 h-screen w-screen flex justify-center overflow-hidden pointer-events-none"
  >
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[500, 10000]}
      infinite={false}
      duration={5000}
      amount={200}
      fallDistance="100vh"
    />
  </div>
{/if}

<div
  in:fade
  class="w-full h-full mx-auto max-w-[22rem] md:max-w-2xl lg:max-w-7xl lg:px-8 mt-32 md:mt-28 mb-16 flex flex-col flex-1"
>
  <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
    <div
      class="bg-neutral-50 p-8 rounded-md border border-neutral-200 shadow-sm"
    >
      <RaceInfo {race} />
    </div>
    <div
      class="bg-neutral-50 p-8 rounded-md border border-neutral-200 shadow-sm"
    >
      {#key [race.raceId, user]}
        <RaceBet
          {race}
          {betTable}
          {user}
          seasonId={data.currentSeason.seasonId}
          raceStart={raceStartMillis}
          on:betSubmitted={updateBetTable}
        />
      {/key}
    </div>
  </div>

  <div
    class="grid grid-cols-1 md:grid-cols-3 items-start md:cols w-full gap-8 mt-8"
  >
    <div class="col-span-2 h-fit">
      <div
        class="bg-neutral-50 p-8 border border-neutral-200 shadow-sm px-4 py-8 md:p-8 rounded-md h-fit"
      >
        <div class="overflow-auto">
          {#key [betTable, user, race.raceId]}
            <table>
              <thead class="border-b border-b-gray-400 bg-neutral-200/10">
                <tr class="hover:cursor-default">
                  <th class="py-3 px-2"><div class="w-8" /></th>
                  <th class="text-left py-3 px-2"
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
                    class="border-b border-b-neutral-200 py-2 hover:bg-neutral-200/30 transition-all ease-in-out duration-300 hover:cursor-default"
                  >
                    <td class="py-3 px-2">
                      <Avatar
                        name={bet.username}
                        avatar={bet.avatar}
                        points={bet.points}
                        position={bet.position}
                        constructorBet={bet.constructorBet}
                      />
                    </td>
                    <td class="py-3 px-2">{bet.username}</td>
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

      <CommentSection {user} raceId={race.raceId} {comments} {users} />
    </div>

    <div
      class="bg-neutral-50 border border-neutral-200 shadow-sm p-8 rounded-md w-full col-span-2 md:col-span-1"
    >
      <h3 class="font-bold mb-4">Grid</h3>
      {#if grid}
        <ol>
          {#each grid as driver, index}
            <div class="flex mb-1">
              <div>
                <span class="text-sm text-neutral-500">{index + 1}.</span>
              </div>
              <div class="pl-2">
                <li>{driver.name}</li>
                <span class="text-sm font-light text-neutral-500"
                  >{driver.lapTime}</span
                >
              </div>
            </div>
          {/each}
        </ol>
      {:else}
        <div class="flex w-full h-full justify-center">
          {#if race.type === "Grand Prix"}
            <p class="font-light text-neutral-500">Grid not available yet</p>
          {:else if race.type === "Sprint"}
            <p class="font-light text-neutral-500 text-center">
              Grid not available for sprint races. Go look it up!
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
