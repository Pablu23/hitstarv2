<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createWebSocketClient } from '$lib/websocketClient';
	import type { Player } from '$lib/types';

	// Game types
	interface SongCard {
		id: number;
		artist: string;
		title: string;
		year: number;
	}

	// WebSocket connection
	let ws = $state(createWebSocketClient());

	// Game $state
	let currentPlayerId = $state<number>(1);
	let cards = $state<SongCard[]>([]);
	let placedCards = $state<SongCard[]>([]);
	let currentCard = $state<SongCard | null>(null);
	let dragPosition = $state<{ x: number; y: number } | null>(null);
	let isDragging = $state<boolean>(false);
	let dragTargetIndex = $state<number>(-1);

	// Music player $state
	let audioProgress = $state(0);
	let audioDuration = $state(240); // 4 minutes in seconds
	let isPlaying = $state(false);

	// Mock player data
	const players: Player[] = [
		{ id: 1, name: 'YourName', isHost: true },
		{ id: 2, name: 'Player2', isHost: false },
		{ id: 3, name: 'GamerX', isHost: false }
	];

	// Mock cards data
	const mockCards = [
		{ id: 1, artist: 'Queen', title: 'Bohemian Rhapsody', year: 1975 },
		{ id: 2, artist: 'Michael Jackson', title: 'Thriller', year: 1982 },
		{ id: 3, artist: 'The Beatles', title: 'Hey Jude', year: 1968 },
		{ id: 4, artist: 'Madonna', title: 'Like a Prayer', year: 1989 }
	];

	// Set up player information
	function getPlayerInfo() {
		const playerIndex = players.findIndex((p) => p.id === currentPlayerId);
		const info = {
			previous: playerIndex > 0 ? players[playerIndex - 1] : null,
			current: players[playerIndex],
			next: playerIndex < players.length - 1 ? players[playerIndex + 1] : null
		};
		return info;
	}

	// Audio player functions
	function togglePlayPause() {
		isPlaying = !isPlaying;

		// In a real app, this would control actual audio playback
		if (isPlaying) {
			startProgressTimer();
		} else {
			stopProgressTimer();
		}
	}

	function updateProgress(event: Event) {
		const target = event.target as HTMLInputElement;
		audioProgress = parseInt(target.value);
	}

	let progressTimer: number | null = null;

	function startProgressTimer() {
		if (progressTimer) return;

		progressTimer = window.setInterval(() => {
			if (audioProgress < audioDuration) {
				audioProgress += 1;
			} else {
				audioProgress = 0;
				isPlaying = false;
				stopProgressTimer();
			}
		}, 1000);
	}

	function stopProgressTimer() {
		if (progressTimer) {
			clearInterval(progressTimer);
			progressTimer = null;
		}
	}

	// Format time as MM:SS
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Card dragging functionality
	function startDrag(event: MouseEvent) {
		// Only allow dragging for the current player
		if (currentPlayerId !== players[0].id) return;

		const card = document.getElementById('current-card');
		if (!card) return;

		// Prevent text selection while dragging
		event.preventDefault();

		isDragging = true;

		const rect = card.getBoundingClientRect();
		dragPosition = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

		// Add a class to prevent text selection while dragging
		document.body.classList.add('no-select');
	}

	function onDrag(event: MouseEvent) {
		if (!isDragging || !dragPosition) return;

		const card = document.getElementById('current-card');
		if (!card) return;

		const x = event.clientX - dragPosition.x;
		const y = event.clientY - dragPosition.y;

		card.style.position = 'fixed';
		card.style.left = `${x}px`;
		card.style.top = `${y}px`;
		card.style.zIndex = '1000';
		card.style.transform = 'none'; // Clear any transform

		// Find the closest card slot
		const cardSlots = document.querySelectorAll('.card-slot');
		let closestDistance = Infinity;
		let closestIndex = -1;

		cardSlots.forEach((slot, index) => {
			const rect = slot.getBoundingClientRect();
			const slotCenterX = rect.left + rect.width / 2;
			const slotCenterY = rect.top + rect.height / 2;

			const distance = Math.sqrt(
				Math.pow(event.clientX - slotCenterX, 2) + Math.pow(event.clientY - slotCenterY, 2)
			);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});

		// Only highlight if we're close enough
		if (closestDistance < 100) {
			dragTargetIndex = closestIndex;
		} else {
			dragTargetIndex = -1;
		}
	}

	function stopDrag() {
		if (!isDragging) return;

		isDragging = false;
		document.body.classList.remove('no-select');

		const card = document.getElementById('current-card');
		if (!card) return;

		// If we have a valid drop target and a current card
		if (dragTargetIndex >= 0 && currentCard) {
			// Place the card in the timeline
			const newCards = [...placedCards];
			newCards.splice(dragTargetIndex, 0, currentCard);
			placedCards = newCards;

			// Send update to other players via WebSocket
			ws.sendMessage({
				type: 'cardPlaced',
				cardId: currentCard!.id,
				position: dragTargetIndex
			});

			// Remove the current card
			currentCard = null;

			// Reset the card position and style
			card.style.position = '';
			card.style.left = '';
			card.style.top = '';
			card.style.zIndex = '';
		} else {
			// Snap back to original position with animation
			card.style.transition = 'all 0.3s ease';
			card.style.position = '';
			card.style.left = '';
			card.style.top = '';
			card.style.zIndex = '';

			setTimeout(() => {
				if (card) card.style.transition = '';
			}, 300);
		}

		// Reset drag $state
		dragPosition = null;
		dragTargetIndex = -1;
	}

	onMount(() => {
		// Set up initial game $state
		placedCards = [mockCards[0], mockCards[1]];
		cards = mockCards.slice(2);
		currentCard = mockCards[3];

		// Set up event listeners for drag and drop
		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', stopDrag);

		// Connect to WebSocket in a real app
		// ws.connect('ws://example.com/game');

		// Mock WebSocket connection
		// setTimeout(() => {
		// 	ws.connected = true;
		// 	ws.players = players;
		// }, 500);
	});

	onDestroy(() => {
		// Clean up event listeners
		// window.removeEventListener('mousemove', onDrag);
		// window.removeEventListener('mouseup', stopDrag);

		// Stop the progress timer
		// stopProgressTimer();

		// Clean up WebSocket connection
		ws.disconnect();
	});
</script>

<div class="min-h-screen bg-white flex flex-col">
	<!-- Header with player info -->
	<div class="bg-indigo-700 text-white px-6 py-3">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center space-x-3">
				{#if getPlayerInfo().previous}
					<div class="flex flex-col items-center">
						<span class="text-xs text-indigo-200">Previous</span>
						<span class="text-sm font-medium">PREVIOUS NAME</span>
					</div>
				{/if}

				<div class="flex flex-col items-center bg-indigo-600 px-4 py-1 rounded-lg">
					<span class="text-xs text-indigo-200">Current</span>
					<span class="text-lg font-semibold">{getPlayerInfo().current?.name}</span>
				</div>

				{#if getPlayerInfo().next}
					<div class="flex flex-col items-center">
						<span class="text-xs text-indigo-200">Next</span>
						<span class="text-sm font-medium">NEXT NAME</span>
					</div>
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				<span class="text-sm">{players.length} Players</span>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col">
		<!-- Music player -->
		<div class="bg-gray-50 rounded-lg shadow-sm p-4 mb-6">
			<div class="flex items-center space-x-4">
				<button
					class="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
					onclick={togglePlayPause}
				>
					{#if isPlaying}
						<!-- Pause icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 9v6m4-6v6m-9-9h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
							/>
						</svg>
					{:else}
						<!-- Play icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					{/if}
				</button>

				<div class="flex-1">
					<input
						type="range"
						min="0"
						max={audioDuration}
						value={audioProgress}
						oninput={updateProgress}
						class="w-full h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer"
					/>
					<div class="flex justify-between text-xs text-gray-500 mt-1">
						<span>{formatTime(audioProgress)}</span>
						<span>{formatTime(audioDuration)}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Game area -->
		<div class="flex-1 flex flex-col">
			<!-- Card placement area - using horizontal scrolling for many cards -->
			<div class="relative py-10 mb-12">
				<div class="overflow-x-auto pb-4">
					<div class="flex space-x-6 min-w-full px-6">
						<div
							class="card-slot relative flex-shrink-0 w-48 h-64 border-2 border-dashed border-gray-200 rounded-lg {dragTargetIndex ===
							0
								? 'highlight'
								: ''}"
						></div>
						{#each placedCards as card, index}
							<!-- Adding card-slot class for drop target detection -->
							<div
								class="card-slot relative flex-shrink-0 w-48 h-64 rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all {dragTargetIndex ===
								index + 1
									? 'highlight'
									: ''}"
							>
								<div class="card absolute inset-0 flex flex-col p-4 bg-white">
									<div class="text-center text-gray-600 text-sm mb-1">Artist</div>
									<div class="text-center font-semibold mb-2">{card.artist}</div>

									<div class="flex-1 flex items-center justify-center">
										<div class="text-3xl font-bold text-indigo-600">{card.year}</div>
									</div>

									<div class="text-center text-gray-600 text-sm mb-1">Title</div>
									<div class="text-center font-semibold">{card.title}</div>
								</div>
							</div>
						{/each}

						<!-- Add an extra slot at the end -->
						<div
							class="card-slot relative flex-shrink-0 w-48 h-64 border-2 border-dashed border-gray-200 rounded-lg {dragTargetIndex ===
							placedCards.length + 1
								? 'highlight'
								: ''}"
						></div>
					</div>
				</div>
			</div>

			<!-- Current card to place - will be draggable -->
			{#if currentCard}
				<div class="flex justify-center mb-8">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						id="current-card"
						class="card relative w-48 h-64 rounded-lg overflow-hidden shadow-lg border border-indigo-400 cursor-move {currentPlayerId !==
						players[0].id
							? 'pointer-events-none opacity-70'
							: ''}"
						onmousedown={startDrag}
					>
						<div class="absolute inset-0 flex flex-col p-4 bg-white">
							<div class="text-center text-gray-600 text-sm mb-1">Artist</div>
							<div class="text-center font-semibold mb-2">{currentCard.artist}</div>

							<div class="flex-1 flex items-center justify-center">
								<div class="text-3xl font-bold text-indigo-600">{currentCard.year}</div>
							</div>

							<div class="text-center text-gray-600 text-sm mb-1">Title</div>
							<div class="text-center font-semibold">{currentCard.title}</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Placeholder when no card is available -->
				<div class="flex justify-center mb-8">
					<div
						class="relative w-48 h-64 rounded-lg overflow-hidden shadow border border-gray-200 bg-gray-50 flex items-center justify-center"
					>
						<span class="text-gray-400">Waiting for next card...</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="css">
	/* Prevent text selection during drag */
	:global(.no-select) {
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}

	/* Card styles */
	.card {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	/* Card placement slot highlight */
	.card-slot.highlight {
		border-color: indigo-500;
		background-color: indigo-50;
	}
</style>
