<script lang="ts">
  import { fade } from "svelte/transition";

  export let comment: App.Comment;
  export let users: App.User[];

  const commentUser = users.find(
    //TODO: fix why is this a string??
    (user) => Number(user.userId) === comment.userId
  );
  if (!commentUser) {
    throw new Error("User not found");
  }

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const formattedDate = formatDate(comment.timestamp);
</script>

<div class="flex gap-4 mt-4" in:fade>
  <img
    src={commentUser.avatar}
    alt=""
    class="h-8 w-8 object-cover rounded-full border border-slate-600"
  />
  <div class="flex flex-col">
    <div class="flex gap-2 items-baseline">
      <span class="font-bold">{commentUser.username}</span>
      <span class="text-sm text-neutral-400">{formattedDate}</span>
    </div>
    <p class="text-slate-100">{comment.commentText}</p>
  </div>
</div>
