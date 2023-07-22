<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let fullWidth = false;
</script>

<button
  on:click
  {type}
  class="bg-blue-500 hover:bg-blue-700 rounded-md py-1 px-2 {fullWidth
    ? 'w-full'
    : 'w-fit'}"
>
  <slot />
</button>
