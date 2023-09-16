<script lang="ts">
  import { fade } from "svelte/transition";

  export let comment: App.Comment;
  const stringifiedDate = new Date(comment.created_at).toLocaleString();
</script>

<div class="flex gap-4 mt-4" in:fade>
  <img
    src={comment.avatar}
    alt=""
    class="h-8 w-8 object-cover rounded-full border border-slate-600"
  />
  <div class="flex flex-col">
    <div class="flex gap-2 items-baseline">
      <span class="font-bold">{comment.username}</span>
      <span class="text-sm text-slate-500">{stringifiedDate}</span>
    </div>
    <p class="text-slate-100">{comment.comment}</p>
  </div>
</div>
