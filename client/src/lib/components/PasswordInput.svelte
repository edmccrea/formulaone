<script lang="ts">
  export let name: string;
  export let placeholder: string;
  export let value = "";
</script>

<input
  type="password"
  class="bg-inherit border border-gray-400 focus:border-gray-600 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
  {name}
  {placeholder}
  autocomplete="off"
  bind:value
/>
