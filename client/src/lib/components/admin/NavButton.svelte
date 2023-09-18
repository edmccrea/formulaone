<script lang="ts">
  export let active = false;
  console.log(active);
</script>

<button
  class="py-1 px-4 hover:underline rounded-md transition-all duration-300 ease-in-out w-full text-left {active
    ? 'bg-red-600/80 hover:no-underline'
    : ''}"
>
  <slot />
</button>
