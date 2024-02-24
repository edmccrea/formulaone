<script lang="ts">
  import { fade } from "svelte/transition";
  import { Circle } from "svelte-loading-spinners";

  import Button from "$lib/components/Button.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import PasswordInput from "$lib/components/PasswordInput.svelte";

  export let data: PageData;

  let password = "";
  let confirmPassword = "";
  let loading = false;
  let signupFailed = false;
  let failedSignupMessage = "";
  let signUpSuccess = false;

  const submitRegister: SubmitFunction = async ({ formData }) => {
    if (password !== confirmPassword) {
      signupFailed = true;
      failedSignupMessage = "Passwords do not match";
      return;
    }

    loading = true;
    const { error } = await data.supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      console.error(error);
      loading = false;
      signupFailed = true;
      failedSignupMessage = "Something went wrong";
    } else {
      signUpSuccess = true;
      setTimeout(() => {
        signUpSuccess = false;
      }, 6000);
    }
  };
</script>

<div class="flex w-full main">
  <div class="w-full hidden md:w-2/5 lg:block relative">
    <div class="w-full h-full absolute bg-black/10" />
    <img
      src="https://images.pexels.com/photos/18373116/pexels-photo-18373116/free-photo-of-mclaren-special-livery.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt=""
      class="h-full w-full object-cover"
      in:fade
    />
  </div>

  <div class="w-full h-full flex-1 md:w-3/5">
    <div class="w-full h-full flex justify-center items-center">
      <div class="flex flex-col w-2/4">
        <h2 class="text-4xl">Sign Up</h2>
        <p class="mb-8 text-neutral-500">Create an account</p>
        <form method="POST" class="flex flex-col" use:enhance={submitRegister}>
          <Input name="email" placeholder="Email" />
          <PasswordInput
            name="password"
            placeholder="Password"
            bind:value={password}
          />
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
          />
          <input
            type="password"
            class="bg-inherit border border-gray-400 focus:border-gray-200 shadow-inner rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Password"
            bind:value={password}
            name="password"
            autocomplete="off"
          />
          <input
            type="password"
            class="bg-inherit border border-gray-400 focus:border-gray-200 shadow-inner rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
            autocomplete="off"
          />
          {#if signupFailed}
            <div
              class="bg-red-200 rounded-t-sm mb-2 flex items-center p-2 border-b-4 border-l-red-700"
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

              <p class="text-red-700">{failedSignupMessage}</p>
            </div>
          {/if}
          {#if signUpSuccess}
            <div
              class="bg-green-200 rounded-t-sm mb-2 flex items-center p-2 border-l-4 border-l-green-700"
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

              <p class="text-green-700">Sign up successful!</p>
            </div>
          {/if}
          <Button fullWidth={true} type="submit"
            >{#if loading}
              <div class="h-6 flex justify-center items-center">
                <Circle size="16" color="#FFf" unit="px" duration="1s" />
              </div>
            {:else}
              Sign up
            {/if}</Button
          >
        </form>
        <a
          href="/"
          class="mt-4 text-sm underline text-neutral-400 hover:cursor-pointer"
          >Already have an account? Log in</a
        >
      </div>
    </div>
  </div>
</div>
