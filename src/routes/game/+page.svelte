<script lang="ts">
  import { onMount } from 'svelte';
  import { createWebSocketClient } from '$lib/websocketClient';
  
  interface Card {
    id: number;
    artist: string;
    songTitle: string;
    year: number;
    isFlipped: boolean;
    position: number;
  }
  
  // WebSocket client
  let wsClient = $state(createWebSocketClient());
  
  // Game state
  let isCurrentPlayer = $state(true);
  let currentPlayerId = $state(1); // ID of the current player
  // let audioPlayer = $state<HTMLAudioElement | null>(null);
  let isPlaying = $state(false);
  let audioProgress = $state(0);
  // let audioDuration = $state(0);
  
  // Card state
  const cards = $state<Card[]>([
    { id: 1, artist: "Queen", songTitle: "Bohemian Rhapsody", year: 1975, isFlipped: false, position: 0 },
    { id: 2, artist: "Michael Jackson", songTitle: "Thriller", year: 1982, isFlipped: false, position: 1 },
    { id: 3, artist: "The Beatles", songTitle: "Hey Jude", year: 1968, isFlipped: false, position: 2 },
    { id: 4, artist: "Nirvana", songTitle: "Smells Like Teen Spirit", year: 1991, isFlipped: false, position: 3 },
    { id: 5, artist: "Led Zeppelin", songTitle: "Stairway to Heaven", year: 1971, isFlipped: false, position: 4 }
  ]);
  
  const middleCard = $state<Card>({
    id: 0,
    artist: "Unknown Artist",
    songTitle: "Mystery Song",
    year: 2000,
    isFlipped: true,
    position: -1
  });
  
  // Current player order
  let players = $derived(wsClient.players);
  
  let currentPlayerIndex = $derived(players.findIndex(p => p.id === currentPlayerId));
  let currentPlayer = $derived(currentPlayerIndex >= 0 ? players[currentPlayerIndex] : null);
  let nextPlayer = $derived(currentPlayerIndex >= 0 && currentPlayerIndex < players.length - 1 
    ? players[currentPlayerIndex + 1] 
    : players[0]);
  let previousPlayer = $derived(currentPlayerIndex > 0 
    ? players[currentPlayerIndex - 1]
    : players[players.length - 1]);
    
  function togglePlay() {
    if (/* !audioPlayer || */ !isCurrentPlayer) return;
    
    // if (isPlaying) {
    //   audioPlayer.pause();
    // } else {
    //   audioPlayer.play();
    // }
  }
  
  function updateProgress(e: Event) {
    if (/* !audioPlayer || */ !isCurrentPlayer) return;
    
    // const target = e.target as HTMLInputElement;
    // const newTime = (parseInt(target.value) / 100) * audioDuration;
    // audioPlayer.currentTime = newTime;
  }
  
  function onAudioTimeUpdate() {
    // if (!audioPlayer) return;
    // audioProgress = (audioPlayer.currentTime / audioDuration) * 100;
  }
  
  function onAudioLoaded() {
    // if (!audioPlayer) return;
    // audioDuration = audioPlayer.duration;
  }
  
  function onAudioPlayStateChange() {
    // if (!audioPlayer) return;
    // isPlaying = !audioPlayer.paused;
  }
  
  function startDrag(e: MouseEvent) {
    if (!isCurrentPlayer) return;
    
    // In a real implementation, this would handle the card dragging logic
    // and synchronize positions with other players via WebSockets
    console.log("Started dragging card");
  }
  
  function placeCard(position: number) {
    if (!isCurrentPlayer) return;
    
    // In a real implementation, this would place the card at the specified position
    // and synchronize with other players via WebSockets
    console.log(`Placing card at position: ${position}`);
    
    wsClient.sendMessage({
      type: 'cardPlaced',
      position: position
    });
  }
  
  onMount(() => {
    // Setup audio player
    // audioPlayer = new Audio('/music/sample-song.mp3');
    // 
    // if (audioPlayer) {
    //   audioPlayer.addEventListener('timeupdate', onAudioTimeUpdate);
    //   audioPlayer.addEventListener('loadedmetadata', onAudioLoaded);
    //   audioPlayer.addEventListener('play', onAudioPlayStateChange);
    //   audioPlayer.addEventListener('pause', onAudioPlayStateChange);
    // }
    
    // Connect to WebSocket
    // wsClient.connect('ws://example.com/game');
    
    // For demo purposes, simulate a connection with players
    setTimeout(() => {
      wsClient.connected = true;
      wsClient.players = [
        { id: 1, name: 'YourName', isHost: true },
        { id: 2, name: 'Player2', isHost: false },
        { id: 3, name: 'GamerX', isHost: false },
        { id: 4, name: 'MusicFan', isHost: false }
      ];
      
      // Set current player
      isCurrentPlayer = players[0].id === 1;
    }, 500);
    
    return () => {
      // Cleanup
      // if (audioPlayer) {
      //   audioPlayer.removeEventListener('timeupdate', onAudioTimeUpdate);
      //   audioPlayer.removeEventListener('loadedmetadata', onAudioLoaded);
      //   audioPlayer.removeEventListener('play', onAudioPlayStateChange);
      //   audioPlayer.removeEventListener('pause', onAudioPlayStateChange);
      //   audioPlayer.pause();
      // }
    };
  });
</script>

<div class="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header with player info -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Music Guessing Game</h1>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <!-- Previous Player -->
          <div class="flex flex-col items-center">
            <div class="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
              {previousPlayer?.name.substring(0, 2).toUpperCase() || '??'}
            </div>
            <span class="text-xs text-gray-500 mt-1">Previous</span>
          </div>
          
          <!-- Current Player -->
          <div class="flex flex-col items-center">
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 h-12 w-12 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-offset-2 ring-indigo-500">
              {currentPlayer?.name.substring(0, 2).toUpperCase() || '??'}
            </div>
            <span class="text-sm font-medium text-indigo-700 mt-1">{currentPlayer?.name || 'Current'}</span>
          </div>
          
          <!-- Next Player -->
          <div class="flex flex-col items-center">
            <div class="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
              {nextPlayer?.name.substring(0, 2).toUpperCase() || '??'}
            </div>
            <span class="text-xs text-gray-500 mt-1">Next</span>
          </div>
        </div>
        
        {#if isCurrentPlayer}
          <div class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
            Your turn!
          </div>
        {:else}
          <div class="text-gray-500">
            Waiting for {currentPlayer?.name || 'current player'} to make a move...
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Audio Player -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-8">
      <div class="flex items-center">
        <button 
          class="w-10 h-10 rounded-full flex items-center justify-center {isCurrentPlayer ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}"
          on:click={togglePlay}
          disabled={!isCurrentPlayer}
        >
          {#if isPlaying}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>
        
        <div class="flex-1 ml-4">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={audioProgress} 
            on:input={updateProgress}
            class="{isCurrentPlayer ? 'cursor-pointer' : 'cursor-not-allowed'} w-full h-2 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
            disabled={!isCurrentPlayer}
          />
        </div>
      </div>
    </div>
    
    <!-- Main Game Area -->
    <div class="flex flex-col items-center mb-8">
      <!-- Card placement area -->
      <div class="relative w-full overflow-x-auto py-10">
        <div class="flex justify-center items-center space-x-6 min-w-max px-4">
          <!-- Cards to place -->
          {#each cards as card (card.id)}
            <div class="bg-white shadow-md rounded-lg w-32 h-44 border border-gray-200 p-3 flex flex-col items-center justify-between">
              <div class="text-sm text-gray-800 font-medium">{card.artist}</div>
              <div class="text-xl font-bold text-center text-indigo-700">{card.year}</div>
              <div class="text-sm text-gray-800 text-center">{card.songTitle}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Draggable card in the middle -->
      <div 
        class="relative cursor-move bg-white shadow-lg rounded-lg w-40 h-52 border-2 border-indigo-300 {isCurrentPlayer ? '' : 'cursor-not-allowed'}"
        on:mousedown={isCurrentPlayer ? startDrag : undefined}
      >
        {#if middleCard.isFlipped}
          <!-- Flipped card shows a placeholder -->
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
            <img 
              src="/images/card-placeholder.jpg" 
              alt="Music card" 
              class="w-24 h-24 opacity-30"
            />
          </div>
        {:else}
          <!-- Unflipped card shows song info -->
          <div class="w-full h-full p-4 flex flex-col items-center justify-between">
            <div class="text-sm text-gray-800 font-medium">{middleCard.artist}</div>
            <div class="text-2xl font-bold text-center text-indigo-700">{middleCard.year}</div>
            <div class="text-sm text-gray-800 text-center">{middleCard.songTitle}</div>
          </div>
        {/if}
      </div>
      
      <!-- Positioning indicators -->
      <div class="flex justify-center mt-8 space-x-4">
        {#each Array(cards.length + 1) as _, i}
          <button 
            class="w-8 h-8 rounded-full flex items-center justify-center {isCurrentPlayer ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
            on:click={() => placeCard(i)}
            disabled={!isCurrentPlayer}
          >
            {i + 1}
          </button>
        {/each}
      </div>
    </div>
    
    <div class="text-center text-sm text-gray-500">
      {#if isCurrentPlayer}
        Drag the mystery card and place it where you think it belongs in the timeline!
      {:else}
        Watch as {currentPlayer?.name || 'the current player'} makes their guess!
      {/if}
    </div>
  </div>
</div>
