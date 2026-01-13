<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDB } from '$lib/db/init';

	let { children } = $props();

	// Initialize database on client-side only (no SSR)
	onMount(async () => {
		try {
			await initDB();
			console.log('✅ Database initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize database:', error);
			// In production, you might want to show a user-friendly error message
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
