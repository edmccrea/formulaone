<script lang="ts">
  import { fade } from "svelte/transition";
  import Button from "$lib/components/Button.svelte";
  import { constructors } from "../../../../stores/constructors";
  import Input from "$lib/components/Input.svelte";
  import FileInput from "$lib/components/FileInput.svelte";
  import { Circle } from "svelte-loading-spinners";
  import { toast } from "svelte-sonner";

  let inputImgSrc: string | ArrayBuffer | null;
  let filename: string;
  let username: string;
  let constructorName: string;
  let loading = false;

  async function handleSubmit(event: Event) {
    loading = true;
    event.preventDefault();
    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        avatar: inputImgSrc,
        constructorName,
      }),
    });
    if (res.ok) {
      //Not the smoothest solution, but good enough for now
      toast.success("Profile created");
      window.location.reload();
    } else {
      toast.error(
        "Something went wrong, please try again. If the problem persists, contact Ed"
      );
    }
    loading = false;
  }
</script>

<div
  in:fade
  class="w-full h-full mx-4 md:mx-auto px-4 lg:px-8 mt-28 mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 flex-1"
>
  <div class="flex justify-center flex-col w-full">
    <h2 class="text-3xl md:text-4xl">Create a Profile</h2>
    <p class="mb-8 text-neutral-500">
      Please create a profile before we get started
    </p>
    <form method="POST" class="flex flex-col max-w-96" on:submit={handleSubmit}>
      <Input name="username" placeholder="Username" bind:value={username} />
      <FileInput bind:inputImgSrc bind:filename name="avatar" />
      <select
        name="constructorName"
        id="constructor"
        class="bg-inherit border border-gray-400 rounded-md py-1 px-3 shadow-inner hover:cursor-pointer focus:border-gray-600 transition-all ease-in-out duration-300 focus:outline-none"
        placeholder="Constructor"
        required
        bind:value={constructorName}
      >
        <option value="" disabled selected class="text-neutral-50"
          >Select constructor</option
        >
        {#each $constructors as constructor}
          <option value={constructor}>{constructor}</option>
        {/each}
      </select>
      <div class="mt-4">
        <Button fullWidth type="submit" disabled={loading}
          >{#if loading}
            <div class="h-6 flex justify-center items-center">
              <Circle size="16" color="#FFf" unit="px" duration="1s" />
            </div>
          {:else}Create Profile{/if}</Button
        >
      </div>
    </form>
  </div>

  <div class="rounded-md overflow-hidden shadow-md h-full md:min-h-[600px]">
    <img
      src="https://res.cloudinary.com/edmccrea/image/upload/c_scale,w_1268/v1708978919/F1/toto-christian_jfp4k0.webp"
      alt=""
      class="object-cover w-full h-full"
    />
  </div>
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("/chevron-down.svg");
    background-repeat: no-repeat;
    background-position: calc(100% - 1rem) center;
    background-size: 1em;
  }
</style>
