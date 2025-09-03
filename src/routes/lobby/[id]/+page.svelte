<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>You are in lobby with ID: {data.lobby?.id}</h1>
<h2>Youre username is: {data.username}</h2>

<h2>Players in Lobby: </h2>
<ul>
    {#each data.lobby.usersInLobby as player (player.userEmail)}
        <li>{player.user.username}</li>
    {/each}
</ul>