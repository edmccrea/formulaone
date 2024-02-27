<script lang="ts">
  import { fade } from "svelte/transition";
  import { Circle } from "svelte-loading-spinners";
  import Button from "$lib/components/Button.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import PasswordInput from "$lib/components/PasswordInput.svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let password = "";
  let confirmPassword = "";
  let loading = false;

  const submitRegister: SubmitFunction = async ({ formData }) => {
    const whitelsit = [
      "ed-mccrea@hotmail.co.uk",
      "mccreasteelem@aol.com",
      "peter@wrmontor.com",
      "emily.bengtsson@hotmail.com",
      "alastairpm@hotmail.com",
    ];

    if (!whitelsit.includes(formData.get("email") as string)) {
      toast.error("You are not whitelisted, contact Ed");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
      toast.error(error.message);
    } else {
      goto("/");
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
