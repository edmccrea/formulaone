<script lang="ts">
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { Circle } from "svelte-loading-spinners";
  import Button from "$lib/components/Button.svelte";
  import type { PageData } from "./$types";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import PasswordInput from "$lib/components/PasswordInput.svelte";
  import { toast } from "svelte-sonner";

  export let data: PageData;

  let loading = false;

  const submitLogin: SubmitFunction = async ({ formData }) => {
    loading = true;
    const { error } = await data.supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (error) {
      console.error(error);
      toast.error(error.message);
      loading = false;
    }
    goto("/");
  };
</script>

<div class="flex w-full main relative">
  <div class="md:hidden absolute top-0 left-0 w-screen h-screen -z-10">
    <div class="w-full h-full absolute bg-white/95" />
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
        <p class="mb-8 text-neutral-500">Please sign in to continue</p>
        <form method="POST" class="flex flex-col" use:enhance={submitLogin}>
          <Input name="email" placeholder="Email" />
          <PasswordInput name="password" placeholder="Password" />
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
