<script lang="ts">
  import SideNavigation from "$lib/components/admin/SideNavigation.svelte";
</script>

<div class="flex flex-col flex-1">
  <div class="mx-16 mt-8 pb-8 border-b border-neutral-500">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <p class="text-neutral-400">Alter everything here</p>
  </div>
  <div class="flex">
    <SideNavigation />

    <div class="flex-1 pt-8">
      <slot />
    </div>
  </div>
</div>
