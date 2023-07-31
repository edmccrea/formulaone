<script>
  import { page } from "$app/stores";

  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

{#if $page.url.pathname !== "/login"}
  <Navbar />
{/if}

<main class="flex min-h-screen">
  <slot />
</main>

{#if $page.url.pathname !== "/login"}
  <Footer />
{/if}
