<script lang="ts">
  export let data;
  const users = data.users;
</script>

<div class="pr-16">
  <h2 class="text-2xl">Users</h2>

  <div class="pt-4">
    {#each users as user}
      <div
        class="border-b border-neutral-500 hover:cursor-pointer hover:bg-neutral-700/50 transition-all duration-300 ease-in-out py-2 px-4"
      >
        <a
          href={`/admin/users/${user.user_id}`}
          class="w-full flex items-center gap-4"
        >
          <img
            src={user.avatar}
            alt=""
            class="h-8 w-8 object-cover rounded-full border border-slate-600"
          />
          <p>{user.username}</p>
        </a>
      </div>
    {/each}
  </div>
</div>
