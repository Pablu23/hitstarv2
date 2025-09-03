<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- <div>
	<label>Email: <input type="text" bind:value={email} /></label>
	<label>Username: <input type="text" bind:value={username} /></label>
</div> -->

{#if form?.success}
	<p>Successfully logged out</p>
{/if}

{#if !data.user.isLoggedIn}
	<button onclick={async () => await goto('/login')}> Login </button>
{:else}
	<h2>Hello {data.user.username}</h2>
	<form method="POST" action="?/logout">
		<button type="submit">Logout</button>
	</form>

	<form method="POST" action="?/deleteUsers">
		<button type="submit">Delete all Users</button>
	</form>
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

<ul>
	{#each data.users as user (user.email)}
		<li>
			{user.username} = {user.email}
		</li>
	{/each}
</ul>
