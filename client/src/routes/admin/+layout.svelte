<script lang="ts">
  import "../../app.css";
  import SideNavigation from "$lib/components/admin/SideNavigation.svelte";
</script>

<div class="flex flex-col flex-1">
  <div class="mx-16 mt-8 pb-8 border-b border-neutral-500">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <p class="text-neutral-400">Alter everything here</p>
    <a
      href="/"
      class="underline text-neutral-400 hover:text-neutral-300 transition-all duration-300 ease-in-out"
      >Go to home</a
    >
  </div>
  <div class="flex">
    <SideNavigation />

    <div class="flex-1 py-8">
      <slot />
    </div>
  </div>
</div>
