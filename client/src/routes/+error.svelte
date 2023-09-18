<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import Button from "$lib/components/Button.svelte";
</script>

<div class="h-screen w-screen flex justify-center items-center flex-col gap-4">
  <h1 class="text-3xl">{$page.status}: {$page.error?.message}</h1>
  <a href="/" class="pt-4">
    <Button>Go Home</Button>
  </a>
</div>
