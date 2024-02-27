<script lang="ts">
  import { fade } from "svelte/transition";

  import Button from "$lib/components/Button.svelte";
  import TextInput from "$lib/components/admin/TextInput.svelte";

  export let data;
  const user = data.user!;
  let successfulUpdate = false;
  let errorMessage = "";

  let username = user.username;
  let avatar = user.avatar;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = "";
    successfulUpdate = false;

    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        user_id: Number(user.user_id),
        username,
        avatar,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      successfulUpdate = true;
    } else {
      successfulUpdate = false;
      errorMessage = data;
    }
  }
</script>

<h2 class="text-2xl">{user.username}</h2>
<a href="/admin/users" class="underline">Go back</a>
<h3 class="mt-8 mb-4 text-xl">Update user details</h3>
<form action="" class="flex flex-col gap-4 mr-16" on:submit={handleSubmit}>
  <div class="flex gap-4">
    <TextInput label="Username" bind:value={username} />
  </div>

  <div class="flex gap-4 items-end">
    <div class="flex flex-col gap-4">
      {#key avatar}
        <img
          src={avatar}
          alt=""
          class="object-cover rounded-full w-52 h-52 border border-neutral-600"
        />
      {/key}
      <div class="flex flex-col w-96 relative">
        <label
          for="avatar"
          class="text-sm text-neutral-400 absolute bg-neutral-50 -top-2.5 left-2 px-2"
          >Avatar</label
        >
        <input
          id="avatar"
          type="text"
          bind:value={avatar}
          class="bg-transparent border border-neutral-500 rounded-md py-2 px-4 w-full focus:border-neutral-300 transition-all duration-300 ease"
        />
      </div>
    </div>
  </div>

  {#if successfulUpdate}
    <div
      class="bg-green-200 rounded-t-sm mb-2 flex items-center pl-2 pr-4 py-2 border-l-4 border-l-green-700 w-fit"
      transition:fade
    >
      <svg
        class="mr-2"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="#059669"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p class="text-green-700">Successful update</p>
    </div>
  {/if}
  {#if errorMessage}
    <div
      class="bg-red-200 rounded-t-sm mb-2 flex items-center pl-2 pr-4 py-2 border-l-4 border-l-red-700 w-fit"
      in:fade
    >
      <svg
        class="mr-2"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#b91c1c"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p class="text-red-700">{errorMessage}</p>
    </div>
  {/if}
  <Button type="submit">Update</Button>
</form>
