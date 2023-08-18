<script lang="ts">
  export let users: App.User[];
  const orderedUsers = users.sort((a, b) => b.points - a.points);
</script>

<div>
  <table>
    <thead>
      <tr class="border-b border-b-neutral-503">
        <th class="py-2 px-4" />
        <th class="py-2 px-4 text-left">User</th>
        <th class="py-2 px-4 text-left">Points</th>
        <th class="py-2 px-4 text-left">Constructor Bet</th>
      </tr>
    </thead>
    <tbody>
      {#each orderedUsers as user, i}
        <tr
          class="border-b border-b-neutral-500 hover:bg-neutral-800 duration-200 ease-in-out transition-all"
        >
          <td class="py-2 px-4">{user.position}.</td>
          <td class="py-2 px-4">{user.username}</td>
          <td class="py-2 px-4">{user.points}</td>
          <td class="py-2 px-4">{user.constructor_bet}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
