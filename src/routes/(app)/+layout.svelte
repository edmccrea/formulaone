<script lang="ts">
  import { page } from "$app/stores";
  import "../../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { onMount } from "svelte";
  import { invalidate } from "$app/navigation";
  import { user } from "../../stores/user";
  import { Toaster } from "svelte-sonner";

  export let data;

  if (data.user) {
    $user = data.user;
  }

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        if (_session?.expires_at !== session?.expires_at) {
          invalidate("supabase:auth");
        }

        if (event === "SIGNED_IN" || _session) {
          const res = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: _session?.user.email }),
          });
          if (res.ok) {
            let data = (await res.json()) as { user: App.User };
            if ($user === null) {
              $user = {
                userId: data.user.userId,
                username: data.user.username,
                avatar: data.user.avatar,
                points: data.user.points,
                position: data.user.position,
                constructorBet: data.user.constructorBet,
                constructorId: data.user.constructorId,
                admin: data.user.admin,
                userBets: data.user.userBets,
              };
            }
          } else {
            //TODO: handle what to do here. Need the user to create a profile
            const data = await res.json();
          }
        }
      },
    );
    return () => data.subscription.unsubscribe();
  });

  const hiddenNavRoutes = ["/login", "/register", "/under-construction"];
</script>

<svelte:head>
  <meta
    property="og:image"
    content="https://cdn.racingnews365.com/_1125x633_crop_center-center_85_none/XPB_18286_HiRes.jpg?v=1668070831"
  />
  <meta property="og:title" content="F1 Nerds Bets" />
  <meta property="og:url" content="https://www.silverstonepitcrew.com" />
  <meta property="og:type" content="website" />
</svelte:head>

{#if !hiddenNavRoutes.includes($page.url.pathname)}
  <Navbar supabaseClient={data.supabase} />
{/if}

<main class="flex min-h-screen">
  <slot />
</main>

<Toaster />

{#if $page.url.pathname !== "/login" && $page.url.pathname !== "/register"}
  <Footer />
{/if}
