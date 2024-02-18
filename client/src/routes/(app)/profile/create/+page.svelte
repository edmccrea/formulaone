<script lang="ts">
  import { fade } from "svelte/transition";
  import Button from "$lib/components/Button.svelte";
  import { constructors } from "../../../../stores/constructors";
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-28 mb-12 flex flex-col flex-1"
>
  <h2 class="text-3xl md:text-4xl">Create a Profile</h2>
  <p class="mb-8">Please create a profile before we get started</p>
  <form action="/profile/create" method="POST" class="flex flex-col max-w-96">
    <input
      type="text"
      class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
      name="username"
      placeholder="Username"
    />
    <input
      type="text"
      class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
      name="avatar"
      placeholder="Avatar"
    />
    <select
      name="constructor"
      id="constructor"
      class="bg-inherit border border-gray-400 rounded-md py-1 px-3 hover:cursor-pointer focus:border-gray-200 transition-all ease-in-out duration-300 focus:outline-none"
      placeholder="Constructor"
    >
      {#each $constructors as constructor}
        <option value={constructor}>{constructor}</option>
      {/each}
    </select>
    <div class="mt-4">
      <Button type="submit">Create Profile</Button>
    </div>
  </form>
</div>
