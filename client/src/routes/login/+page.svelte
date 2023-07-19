<script lang="ts">
  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";

  import Button from "$lib/components/Button.svelte";

  let username = "";
  let password = "";

  async function handleLogin(e: Event) {
    e.preventDefault();
    const url = "http://localhost:8080/auth/login";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const status = res.status;
    if (status === 200) {
      goto("/");
    }
  }
</script>

<div
  class="justify-self-center w-full h-full flex justify-center mt-32"
  in:slide
>
  <div class="flex flex-col items-center">
    <h1 class="text-7xl">Formula One Bets</h1>
    <h2 class="text-2xl my-4">Sign in</h2>
    <form action="" class="flex flex-col" on:submit={handleLogin}>
      <input
        type="text"
        class="bg-inherit border border-gray-400 rounded-md py-1 px-3 mb-4"
        placeholder="Name"
        bind:value={username}
      />
      <input
        type="password"
        class="bg-inherit border border-gray-400 rounded-md py-1 px-3 mb-4"
        placeholder="Password"
        bind:value={password}
      />
      <Button kind="primary" type="submit">Sign in</Button>
    </form>
    <p class="mt-4">Forgot your password? Ask Ed</p>
  </div>
</div>
