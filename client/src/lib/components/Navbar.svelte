<script lang="ts">
import Button from './Button.svelte';

</script>

<nav class="w-full py-6 border-b border-b-gray-400">
    <ul class="flex justify-between px-8">
        <li><a href="/">Home</a></li>
        <li><a href="/logout"><Button>Logout</Button></a></li>
    </ul>
</nav>