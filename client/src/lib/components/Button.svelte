<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button
  on:click
  {type}
  class="bg-blue-500 hover:bg-blue-700 rounded-md py-1 px-2 w-fit"
>
  <slot />
</button>
