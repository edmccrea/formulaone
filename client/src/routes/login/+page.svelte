<script>
  import { slide } from "svelte/transition";

  import Button from "$lib/components/Button.svelte";
</script>

<div
  class="justify-self-center w-full h-full flex justify-center mt-32"
  in:slide
>
  <div class="flex flex-col items-center">
    <h1 class="text-7xl">Formula One Bets</h1>
    <h2 class="text-2xl my-4">Sign in</h2>
    <form action="" class="flex flex-col">
      <input
        type="text"
        class="bg-inherit border border-gray-400 rounded-md py-1 px-3 mb-4"
        placeholder="Name"
      />
      <input
        type="password"
        class="bg-inherit border border-gray-400 rounded-md py-1 px-3 mb-4"
        placeholder="Password"
      />
      <Button kind="primary" type="submit">Sign in</Button>
    </form>
    <p class="mt-4">Forgot your password? Ask Ed</p>
  </div>
</div>
