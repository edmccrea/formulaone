<script lang="ts">
  export let kind: "primary" | "secondary" = "primary";
  export let type: "button" | "submit" | "reset" = "button";
</script>

<button
  {type}
  class={kind === "primary"
    ? "bg-blue-500 hover:bg-blue-700"
    : kind === "secondary"
    ? "bg-pink"
    : "bg-inherit"}
>
  <slot />
</button>
