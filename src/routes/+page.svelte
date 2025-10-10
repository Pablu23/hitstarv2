<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let lobbyCode = $state('');
	let isLoggingIn = $state(false);
	let loginError = $state('');

	let { data }: PageProps = $props();
	let user = $state(data.user);

	// Example login function (would connect to a real auth service)
	function handleLogin() {
		isLoggingIn = true;
		loginError = '';

		goto('/login');
	}

	function handleLogout() {
		user = null;

		goto('/logout');
	}

	function createLobby() {
		goto('/lobby/create');
	}

	function joinLobby() {
		if (lobbyCode.trim()) {
			goto(`/lobby/${lobbyCode}`);
		}
	}
</script>

<div class="min-h-screen bg-white flex flex-col">
	<!-- Header -->
	<header class="bg-white shadow-sm py-4">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
			<h1 class="text-2xl font-bold text-indigo-600">Hitstar</h1>

			{#if user}
				<div class="flex items-center">
					<span class="mr-4 text-gray-700">Welcome, {user.username}</span>
					<button
						class="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
						onclick={handleLogout}
					>
						Log Out
					</button>
				</div>
			{/if}
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-4">
		<div class="w-full max-w-md">
			<!-- Hero -->
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold text-gray-800 mb-4">Test Your Music Knowledge</h2>
				<p class="text-xl text-gray-600">Place songs on a timeline in the correct order.</p>
			</div>

			{#if !user}
				<!-- Login Section -->
				<div class="bg-white rounded-lg shadow-md p-8 mb-6">
					<h3 class="text-xl font-semibold text-gray-800 mb-6">Sign In to Play</h3>

					{#if loginError}
						<div class="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
							{loginError}
						</div>
					{/if}

					<button
						class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex justify-center items-center"
						onclick={handleLogin}
						disabled={isLoggingIn}
					>
						{#if isLoggingIn}
							<svg
								class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Logging in...
						{:else}
							Login to Play
						{/if}
					</button>
				</div>
			{:else}
				<!-- Game Options -->
				<div class="bg-white rounded-lg shadow-md p-8 space-y-6">
					<h3 class="text-xl font-semibold text-gray-800 mb-6">Ready to Play?</h3>

					<button
						class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"
						onclick={createLobby}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Create New Lobby
					</button>

					<div class="relative mt-4">
						<div class="flex rounded-md shadow-sm">
							<input
								type="text"
								bind:value={lobbyCode}
								placeholder="Enter lobby code"
								class="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<button
								class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
								onclick={joinLobby}
								disabled={!lobbyCode.trim()}
							>
								Join Lobby
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>
