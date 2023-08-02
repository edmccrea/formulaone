<script lang="ts">
import Button from './Button.svelte';

</script>

<nav class="w-full py-6 border-b border-b-gray-400 fixed backdrop-blur-md bg-[#121212]/60 z-50">
    <ul class="flex justify-between px-8">
        <li class="flex justify-start items-center"><a href="/">Home</a></li>
        <li><a href="/logout"><Button>Logout</Button></a></li>
    </ul>
</nav>