<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "./Button.svelte";

  async function handleLogout() {
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (res.ok) {
      goto("/login");
    }
  }
</script>

<nav
  class="w-full py-6 border-b border-b-gray-400 fixed backdrop-blur-md bg-[#121212]/60 z-50"
>
  <ul class="flex justify-between px-8">
    <li class="flex justify-start items-center"><a href="/">Home</a></li>
    <li><Button on:click={handleLogout}>Logout</Button></li>
  </ul>
</nav>
