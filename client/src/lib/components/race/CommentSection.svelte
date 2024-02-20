<script lang="ts">
  import { fade } from "svelte/transition";

  import Button from "../Button.svelte";
  import Comment from "./Comment.svelte";

  export let user: App.User | null;
  export let raceId: number;
  export let comments: App.Comment[];
  export let users: App.User[];
  comments = comments.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  let isActive = false;

  function handleFocus() {
    isActive = true;
  }

  function handleUnfocus() {
    isActive = false;
  }

  let newComment = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!newComment || !user) return;

    const res = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({
        raceId: Number(raceId),
        userId: Number(user.userId),
        commentText: newComment,
      }),
    });

    if (res.ok) {
      comments = [
        ...comments,
        {
          commentId: 9999999999,
          raceId: raceId,
          userId: Number(user.userId),
          timestamp: new Date(),
          commentText: newComment,
        },
      ];
      comments = comments.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      newComment = "";
    }
  }
</script>

<div
  class="bg-neutral-50 border border-neutral-200 shadow-sm p-8 rounded-md h-fit mt-4 transition-all ease-in-out duration-300"
>
  <form on:submit={handleSubmit}>
    <div class="flex flex-col">
      <div class="flex gap-4">
        <img
          src={user?.avatar}
          alt=""
          class="h-12 w-12 object-cover rounded-full border border-slate-600"
        />
        <input
          on:focus={handleFocus}
          on:blur={handleUnfocus}
          bind:value={newComment}
          type="text"
          placeholder="Add a comment..."
          class="border-b border-b-slate-300/50 bg-transparent flex-1 py-2 px-2 focus:border-b-slate-200 active:border-b-slate-200 focus:py-2 active:py-2 focus:px-2 active:px-2 transition-all ease-in-out duration-300"
        />
      </div>
      {#if isActive || newComment}
        <div in:fade class="mt-3 place-items-end">
          <div class="w-fit ml-auto">
            <Button type="submit">Comment</Button>
          </div>
        </div>
      {/if}
    </div>
  </form>
  {#key comments}
    {#each comments as comment}
      <Comment {comment} {users} />
    {/each}
  {/key}
</div>
