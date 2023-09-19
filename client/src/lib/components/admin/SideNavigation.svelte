<script lang="ts">
  import { page as pageStore } from "$app/stores";
  import NavButton from "./NavButton.svelte";

  const pages = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Races",
      path: "/admin/races",
    },
  ];
</script>

<nav class="flex flex-col px-12 py-8 h-full w-1/4">
  {#each pages as page}
    <a href={page.path}>
      <NavButton
        active={$pageStore.url.pathname.split("/").slice(0, 3).join("/") ===
          page.path}
      >
        {page.name}
      </NavButton>
    </a>
  {/each}
</nav>
