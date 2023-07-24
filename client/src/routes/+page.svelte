<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import RaceCard from "$lib/components/race/RaceCard.svelte";

  export let data;
  const username = data.user.username;
  const races = data.races;

  async function getAllUsers() {
    const url = "/api/users";
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-session-id": data.sessionId || "",
      },
    });

    const resData = await res.json();
    console.log(resData);
  }

  async function getAllRaces() {
    const url = "/api/races";
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-session-id": data.sessionId || "",
      },
    });

    const resData = await res.json();
    console.log(resData);
  }
</script>

<div
  class="w-full h-full mx-4 lg:mx-auto max-w-sm lg:max-w-4xl mt-12 flex flex-col flex-1"
>
  <h1 class="text-5xl font-bold mb-4">Formula One Bets 2023</h1>
  <p>Hello {username}, you're currently in nth place with n points</p>

  <div class="mt-4">
    <h2 class="font-bold text-2xl">Upcoming Race</h2>
    <p>If race is this week, then display a countdown</p>
    <RaceCard />
  </div>

  <div class="mt-4">
    <h2 class="font-bold text-2xl">Leaderboard</h2>
  </div>

  <div class="mt-4">
    <h2 class="font-bold text-2xl">Previous Races</h2>
  </div>

  <div class="mt-4">
    <h2 class="font-bold text-2xl">Previous Races</h2>
  </div>

  <div class="mt-12">
    <h2>Dev stuff</h2>
    <div class="flex flex-col gap-4">
      <a href="/login" class="w-fit">Go to login page</a>

      <Button on:click={getAllUsers}>Get all users</Button>
      <Button on:click={getAllRaces}>Get all races</Button>

      <a href="/logout" class="w-fit" data-sveltekit-preload-data="off">
        <Button>Logout</Button>
      </a>
    </div>
  </div>
</div>
