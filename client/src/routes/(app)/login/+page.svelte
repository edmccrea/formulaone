<script lang="ts">
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { Circle } from "svelte-loading-spinners";

  import Button from "$lib/components/Button.svelte";
  import type { PageData } from "./$types";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { enhance } from "$app/forms";

  export let data: PageData;

  let loading = false;
  let loginFailed = false;
  let failedLoginMessage = "";

  const submitLogin: SubmitFunction = async ({ formData }) => {
    loading = true;
    const { error } = await data.supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) {
      console.error(error);
      loading = false;
      loginFailed = true;
      failedLoginMessage = "Something went wrong";
    }
    goto("/");
  };
</script>

<div class="flex w-full main relative">
  <div class="md:hidden absolute top-0 left-0 w-screen h-screen -z-10">
    <div class="w-full h-full absolute bg-black/80" />
    <img
      src="https://images.pexels.com/photos/12359137/pexels-photo-12359137.jpeg"
      alt=""
      class="w-full h-full object-cover"
    />
  </div>
  <div class="w-full h-full flex-1 lg:w-2/4">
    <div class="w-full h-full flex justify-center items-center">
      <div class="flex flex-col w-3/5 lg:w-2/5">
        <h2 class="text-3xl md:text-4xl">Welcome Back</h2>
        <p class="mb-8">Please sign in to continue</p>
        <form method="POST" class="flex flex-col" use:enhance={submitLogin}>
          <input
            type="text"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Email"
            autocomplete="off"
            name="email"
          />
          <input
            type="password"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Password"
            autocomplete="off"
            name="password"
          />
          {#if loginFailed}
            <div
              class="bg-red-200 rounded-t-sm mb-2 flex items-center p-2 border-l-4 border-l-red-700"
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

              <p class="text-red-700">{failedLoginMessage}</p>
            </div>
          {/if}
          <Button fullWidth={true} type="submit"
            >{#if loading}
              <div class="h-6 flex justify-center items-center">
                <Circle size="16" color="#FFf" unit="px" duration="1s" />
              </div>
            {:else}
              Login
            {/if}</Button
          >
        </form>
        <p class="mt-4 text-sm">Forgot your password? Ask Ed</p>
      </div>
    </div>
  </div>

  <div class="w-full hidden lg:w-2/4 lg:block relative">
    <div class="w-full h-full absolute bg-black/25" />
    <img
      src="https://images.pexels.com/photos/12359137/pexels-photo-12359137.jpeg"
      alt=""
      class="h-full w-full object-cover"
      in:fade
    />
  </div>
</div>
