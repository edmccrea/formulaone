<script lang="ts">
  export let users: App.User[];
  const orderedUsers = users.sort((a, b) => b.points - a.points);
</script>

<div class="overflow-auto">
  <table>
    <thead>
      <tr class="border-b border-b-neutral-300 bg-neutral-200/10">
        <th class="py-2 px-2" />
        <th class="py-2 px-2 text-left">User</th>
        <th class="py-2 px-4 text-left">Points</th>
        <th class="py-2 px-4 text-left min-w-fit whitespace-nowrap"
          >Constructor Bet</th
        >
      </tr>
    </thead>
    <tbody>
      {#each orderedUsers as user}
        <tr
          class="border-b border-b-neutral-200 hover:bg-neutral-100 duration-200 ease-in-out transition-all"
        >
          <td class="py-2 px-4 min-w-10"
            ><img
              class="w-8 h-8 min-w-8 rounded-full border border-slate-600 object-cover"
              src={user.avatar}
              alt=""
            /></td
          >
          <td
            class="py-2 px-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
            >{user.username}</td
          >
          <td class="py-2 px-4">{user.points}</td>
          <td class="py-2 px-4">{user.constructorBet}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
