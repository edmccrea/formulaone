<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";

  export let data;
  const username = data.username;

  async function logout() {
    const url = "http://localhost:8080/auth/logout";
    const res = await fetch(url, {
      method: "POST",
    });

    if (res.status === 200) {
      goto("/login");
    }
  }
</script>

<div class="w-full h-full">
  <h1 class="text-3xl font-bold underline">Welcome to F1 Bet</h1>
  <p>Hello {username}, you're currently sitting in last place</p>

  <div>
    <h2>Here is the leaderboard div</h2>
  </div>

  <div>
    <h2>Here is the upcoming race div</h2>
  </div>

  <div>
    <h2>Here is the calendar div</h2>
  </div>

  <a href="/login">Go to login page</a>

  <Button on:click={logout}>Logout</Button>

  <!-- Scoreboard -->

  <!-- Upcoming Race -->

  <!-- Calendar -->
</div>
