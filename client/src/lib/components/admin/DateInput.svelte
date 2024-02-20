<script lang="ts">
  export let label: string;
  export let value: string;

  const slugifiedLabel = label
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
</script>

<div class="flex flex-col relative">
  <label
    for={slugifiedLabel}
    class="text-sm text-neutral-400 absolute bg-neutral-50 -top-2.5 left-2 px-2"
    >{label}</label
  >
  <input
    id={slugifiedLabel}
    type="date"
    bind:value
    class="bg-transparent border border-neutral-500 rounded-md py-3 px-4 w-fit focus:border-neutral-300 transition-all duration-300 ease"
  />
</div>
