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
  class="w-full py-6 border-b border-b-gray-400 fixed backdrop-blur-md bg-[#121212]/60 z-50 flex justify-between px-8"
>
  <a href="/" class="flex items-center">
    <img src="/f1.png" alt="" class="h-6" /></a
  >
  <ul class="flex gap-4 items-center">
    <li><Button on:click={handleLogout}>Logout</Button></li>
  </ul>
</nav>
