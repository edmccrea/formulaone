<script lang="ts">
  import { fade } from "svelte/transition";
  import Button from "$lib/components/Button.svelte";
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto max-w-sm md:max-w-2xl lg:max-w-6xl lg:px-8 mt-28 mb-12 flex flex-col flex-1"
>
  <h1>Create a profile</h1>
  <form
    action="/profile/create"
    method="POST"
    class="flex flex-col gap-2 max-w-96"
  >
    <input type="text" name="username" placeholder="Username" />
    <input type="text" name="avatar" placeholder="Avatar" />
    <Button type="submit">Create Profile</Button>
  </form>
</div>
