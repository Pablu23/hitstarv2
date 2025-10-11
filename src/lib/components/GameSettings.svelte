<script lang="ts">
	import type { GameMode, Playlist, Settings } from '../../app';
	import PlaylistSelector from './PlaylistSelector.svelte';

	let {
		settings,
		gameModes,
		playlists,
		isHost,
		onUpdate
	}: {
		settings: Settings;
		gameModes: GameMode[];
		playlists: Playlist[];
		isHost: boolean;
		onUpdate: (settings: Settings) => void;
	} = $props();

	let localSettings = $state<Settings>({
		maxPlayers: settings.maxPlayers,
		gameMode: settings.gameMode,
		selectedPlaylistId: settings.selectedPlaylistId
	});

	function updateMaxPlayers(value: number) {
		if (value >= 2 && value <= 16) {
			localSettings.maxPlayers = value;
			onUpdate(localSettings);
		}
	}

	function updateGameMode(modeId: string) {
		localSettings.gameMode = modeId;
		onUpdate(localSettings);
	}

	function updatePlaylist(playlistId: string) {
		localSettings.selectedPlaylistId = playlistId;
		onUpdate(localSettings);
	}

	let selectedPlaylist = $derived(
		playlists.find((p: Playlist) => p.id === localSettings.selectedPlaylistId)
	);
	let selectedGameMode = $derived(gameModes.find((m: GameMode) => m.id === localSettings.gameMode));
</script>

<div class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
	<h2 class="text-xl font-semibold text-gray-800 mb-4">Game Settings</h2>

	{#if isHost}
		<div class="space-y-6">
			<div>
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
				<div class="flex items-center">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-600 h-10 w-10 rounded-l flex items-center justify-center"
						onclick={() => updateMaxPlayers(localSettings.maxPlayers - 1)}
						disabled={localSettings.maxPlayers <= 2}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
					<span
						class="h-10 bg-gray-100 text-gray-800 font-medium px-4 flex items-center justify-center min-w-[50px]"
					>
						{localSettings.maxPlayers}
					</span>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-600 h-10 w-10 rounded-r flex items-center justify-center"
						onclick={() => updateMaxPlayers(localSettings.maxPlayers + 1)}
						disabled={localSettings.maxPlayers >= 16}
					>
						<svg
							xmlns="http:/www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div>
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="block text-sm font-medium text-gray-700 mb-2">Game Mode</label>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					{#each gameModes as mode (mode.id)}
						<button
							class="p-3 rounded-lg text-center transition-colors {localSettings.gameMode ===
							mode.id
								? 'bg-blue-100 border-blue-200 text-blue-700'
								: 'bg-gray-50 border-gray-100 text-gray-700'} border"
							onclick={() => updateGameMode(mode.id)}
						>
							{mode.name}
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-4">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="block text-sm font-medium text-gray-700 mb-2">Playlist</label>
				<PlaylistSelector
					{playlists}
					selectedPlaylistId={localSettings.selectedPlaylistId}
					onSelect={updatePlaylist}
				/>
			</div>
		</div>
	{:else}
		<p class="text-gray-600 italic mb-4">The host is configuring game settings...</p>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="bg-gray-50 p-3 rounded-md">
				<p class="text-sm text-gray-500 mb-1">Max Players</p>
				<p class="font-medium">{settings.maxPlayers}</p>
			</div>
			<div class="bg-gray-50 p-3 rounded-md">
				<p class="text-sm text-gray-500 mb-1">Game Mode</p>
				<p class="font-medium">{selectedGameMode?.name || 'Unknown'}</p>
			</div>
			<div class="bg-gray-50 p-3 rounded-md">
				<p class="text-sm text-gray-500 mb-1">Playlist</p>
				<p class="font-medium">{selectedPlaylist?.name || 'Unknown'}</p>
			</div>
		</div>
	{/if}
</div>
