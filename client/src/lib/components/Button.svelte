<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let fullWidth = false;
  export let disabled = false;
</script>

<button
  {disabled}
  on:click
  {type}
  class="bg-red-500 hover:bg-red-700 rounded-md py-1 px-2 transition-all ease-in-out duration-300 text-neutral-50 {fullWidth
    ? 'w-full'
    : 'w-fit'}"
>
  <slot />
</button>
