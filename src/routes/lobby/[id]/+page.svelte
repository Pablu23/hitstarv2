<script lang="ts">
	import type { PageProps } from './$types';
	import { onDestroy } from 'svelte';

	let { data }: PageProps = $props();

	onDestroy(() => console.log('left site'));
</script>

<h1>You are in lobby with ID: {data.lobby?.id}</h1>
<h2>Your username is: {data.username}</h2>

<h2>Players in Lobby:</h2>
<ul>
	{#each data.lobby.usersInLobby as player (player.userEmail)}
		<li>{player.user.username}</li>
	{/each}
</ul>
