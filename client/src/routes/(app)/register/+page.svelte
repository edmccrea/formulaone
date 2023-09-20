<script lang="ts">
  import { fade } from "svelte/transition";
  import { Circle } from "svelte-loading-spinners";

  import Button from "$lib/components/Button.svelte";

  let username = "";
  let password = "";
  let confirmPassword = "";
  let avatar = "";
  let loading = false;
  let signupFailed = false;
  let failedSignupMessage = "";
  let signUpSuccess = false;

  async function handleRegister() {
    if (password !== confirmPassword) {
      signupFailed = true;
      failedSignupMessage = "Passwords do not match";
      return;
    }

    loading = true;
    signupFailed = false;
    failedSignupMessage = "";

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        avatar,
      }),
    });

    if (res.ok) {
      signUpSuccess = true;
      username = "";
      password = "";
      confirmPassword = "";
      avatar = "";

      setTimeout(() => {
        signUpSuccess = false;
      }, 6000);
    } else {
      signupFailed = true;
      const data = await res.json();
      failedSignupMessage = data.message;
    }
    loading = false;
  }
</script>

<div class="flex w-full main">
  <div class="w-full h-full flex-1 lg:w-2/4">
    <div class="w-full h-full flex justify-center items-center">
      <div class="flex flex-col w-3/5 lg:w-2/5">
        <h2 class="text-4xl">Sign Up</h2>
        <p class="mb-8">Create an account</p>
        <form action="" class="flex flex-col" on:submit={handleRegister}>
          <input
            type="text"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Name"
            bind:value={username}
          />
          <input
            type="password"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Password"
            bind:value={password}
            autocomplete="off"
          />
          <input
            type="password"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
            autocomplete="off"
          />
          <input
            type="text"
            class="bg-inherit border border-gray-400 focus:border-gray-200 rounded-md py-1 px-3 mb-4 ease-in-out transition-all duration-300"
            placeholder="Avatar URL"
            bind:value={avatar}
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
          >Back to home page</a
        >
      </div>
    </div>
  </div>

  <div class="w-full hidden lg:w-2/4 lg:block relative">
    <div class="w-full h-full absolute bg-black/10" />
    <img
      src="https://images.pexels.com/photos/18373116/pexels-photo-18373116/free-photo-of-mclaren-special-livery.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt=""
      class="h-full w-full object-cover"
      in:fade
    />
  </div>
</div>
