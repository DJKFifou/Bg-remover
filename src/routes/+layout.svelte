<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="w-full flex items-center justify-between p-4 bg-gray-100">
	<a href="/">
		<img src="/src/lib/assets/logo.png" alt="Logo" class="h-12 w-12" />
	</a>
	<span class="font-bold text-lg">Bg Remover</span>
	<a
		href="/remove"
		class="px-4 py-2 bg-black text-white border rounded-xl hover:bg-white hover:text-black"
		>Remove</a
	>
</header>

{@render children()}
