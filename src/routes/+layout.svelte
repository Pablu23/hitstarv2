<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<!-- Footer -->
<footer class="bg-white py-6">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<p class="text-center text-gray-500 text-sm">
			© 2025 Pablu. All rights reserved.
		</p>
	</div>
</footer>
