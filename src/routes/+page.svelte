<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let users = $state(data.users);
	let user = $state(data.user);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- <div>
	<label>Email: <input type="text" bind:value={email} /></label>
	<label>Username: <input type="text" bind:value={username} /></label>
</div> -->

{#if !user.isLoggedIn}
	<button onclick={async () => await goto('/login')}> Login </button>
{:else}
	<h2>Hello {user.username}</h2>
	<button
		onclick={async () => {
			user.username = "";
			user.email = "";
			user.isLoggedIn = false;
			await goto('/logout');
		}}
	>
		Logout
	</button>
{/if}
<!-- 
<button
	onclick={async () => {
		const response = await fetch('/api/createUser', {
			method: 'POST',
			body: JSON.stringify({
				email: email,
				username: username
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		console.log(response.status);

		if (response.ok) {
			const newUser: Array<any> = await response.json();
			users.push(...newUser);
		} else {
			console.log(`Encountered Error ${response.status}`);
		}
	}}>Create User</button
> -->

<button
	onclick={async () => {
		const response = await fetch('/api/deleteUsers', {
			method: 'POST'
		});

		users.splice(0, users.length);
	}}>Delete all Users</button
>

<ul>
	{#each users as user (user.email)}
		<li>
			{user.username} = {user.email}
		</li>
	{/each}
</ul>
