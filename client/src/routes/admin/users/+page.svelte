<script lang="ts">
  import Button from "$lib/components/Button.svelte";

  export let data;
  const users = data.users;
</script>

<div class="pr-16">
  <h2 class="text-2xl">Users</h2>

  <div class="pt-4">
    {#each users as user}
      <div
        class="flex items-center gap-4 border-b border-neutral-500 hover:bg-neutral-800 transition-all duration-300 ease-in-out py-2 px-4 w-fit"
      >
        <img
          src={user.avatar}
          alt=""
          class="h-8 w-8 object-cover rounded-full border border-slate-600"
        />
        <p class="w-56">{user.username}</p>
        <a href={`/admin/users/${user.user_id}`}>
          <Button>Edit</Button>
        </a>
      </div>
    {/each}
  </div>
</div>
