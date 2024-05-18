<script lang="ts">
  import { fade } from "svelte/transition";
  import { formatDistanceToNow } from "date-fns";
  import Avatar from "../Avatar.svelte";

  export let comment: App.Comment;
  export let users: App.User[];

  const commentUser = users.find(
    //TODO: fix why is this a string??
    (user) => Number(user.userId) === Number(comment.userId)
  );
  if (!commentUser) {
    throw new Error("User not found");
  }
</script>

<div class="flex gap-4 mt-4" in:fade>
  <Avatar
    name={commentUser.username}
    avatar={commentUser.avatar}
    points={commentUser.points}
    position={commentUser.position}
    constructorBet={commentUser.constructorBet}
  />
  <div class="flex flex-col">
    <div class="flex gap-2 items-baseline">
      <span class="font-bold">{commentUser.username}</span>
      <span class="text-sm text-neutral-400"
        >{formatDistanceToNow(new Date(comment.timestamp), {
          addSuffix: true,
        })}</span
      >
    </div>
    <p>{comment.commentText}</p>
  </div>
</div>
