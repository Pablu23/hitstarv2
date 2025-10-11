<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { wsClient } from '$lib/websocketClient.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import GameSettings from '$lib/components/GameSettings.svelte';
	import type { PageProps } from './$types';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';
	import type { GameMode, Settings } from '../../../app';

	// Create WebSocket client

	// Current user state

	let { data }: PageProps = $props();

	let lobbyCode = $state(data.lobby.id);
	let isHost = $state(data.user.email === data.lobby.host.email); // Assume current user is host for this example

	// Available options for settings
	let gameModes = $state<GameMode[]>([
		{ id: 'classic', name: 'Classic Mode' },
		{ id: 'team', name: 'Team Battle' },
		{ id: 'speed', name: 'Speed Round' }
	]);

	let playlists = $state(data.playlists);
	function handleSettingsUpdate(settings: Settings) {
		// Send updated settings to other players via websocket
		wsClient.gameSettings = settings;
		wsClient.sendMessage({
			type: 'settingsUpdate',
			settings: settings
		});
	}

	function startGame() {
		wsClient.sendMessage({
			type: 'startGame',
			settings: wsClient.gameSettings
		});
		// In a real app, this would navigate to the game screen
	}

	function copyLobbyCode() {
		navigator.clipboard.writeText(lobbyCode);
		// Would show a toast notification in a real app
	}

	function leaveLobby() {
		wsClient.sendMessage({
			type: 'leaveGame',
			player: data.user.email
		});
		wsClient.disconnect();
		goto('/');
		// In a real app, you'd likely redirect to another page here
	}

	onMount(() => {
		if (!env.PUBLIC_API_WS_BASE) {
			goto('/error');
			return;
		}

		const u = new URL(`lobby?id=${lobbyCode}`, env.PUBLIC_API_WS_BASE);
		wsClient.connect(u.href);
		wsClient.gameSettings = data.lobby.gameSettings;
	});

	onDestroy(() => {
		// Clean up WebSocket connection when component is destroyed
		leaveLobby();
	});
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-gray-900">Game Lobby</h1>
			<div class="mt-3 flex items-center justify-center">
				<span class="text-gray-600 mr-2">Invite your friends using code:</span>
				<span
					class="font-mono bg-white px-3 py-1.5 rounded-md border border-gray-200 text-blue-600 font-semibold"
					>{lobbyCode}</span
				>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button
					class="ml-2 p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
					title="Copy to clipboard"
					onclick={copyLobbyCode}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
						<path
							d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Left column: Player list -->
			<div class="md:col-span-1">
				{#if wsClient.connected}
					<PlayerList
						players={wsClient.players}
						maxPlayers={wsClient.gameSettings.maxPlayers}
						host={data.lobby.host}
					/>
				{:else}
					<div class="bg-white rounded-lg shadow-sm p-5 flex items-center justify-center">
						<div class="flex items-center text-amber-600">
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5"
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
							Connecting to lobby...
						</div>
					</div>
				{/if}
			</div>

			<!-- Right column: Game settings and controls -->
			<div class="md:col-span-2 space-y-6">
				<GameSettings
					settings={wsClient.gameSettings}
					{gameModes}
					{playlists}
					{isHost}
					onUpdate={handleSettingsUpdate}
				/>

				<!-- Action buttons -->
				<div class="flex justify-between">
					<button
						class="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						onclick={leaveLobby}
					>
						Leave Lobby
					</button>

					{#if isHost}
						<button
							class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
							onclick={startGame}
						>
							<span>Start Game</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 ml-1.5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					{:else}
						<div class="text-gray-500 italic self-center flex items-center">
							<svg
								class="animate-pulse h-5 w-5 mr-2 text-blue-400"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<circle cx="12" cy="12" r="10" />
							</svg>
							Waiting for host to start...
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
