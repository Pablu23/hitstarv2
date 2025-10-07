<script lang="ts">
  import type { Player } from '$lib/types';
  
  let {players = [], maxPlayers = 8 }: { players: Player[], maxPlayers: number} = $props();
</script>

<div class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-gray-800">Players</h2>
    <span class="text-sm text-gray-500">{players.length}/{maxPlayers}</span>
  </div>
  
  <ul class="space-y-2">
    {#each players as player (player.id)}
      <li class="flex items-center p-2 rounded-md {player.isHost ? 'bg-blue-50' : 'bg-gray-50'}">
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {player.name.substring(0, 2).toUpperCase()}
        </div>
        <span class="ml-2 text-gray-800 font-medium">{player.name}</span>
        
        {#if player.isHost}
          <span class="ml-auto flex items-center text-blue-600 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.504 5.071a.5.5 0 01.992 0l1.5 10a.5.5 0 01-.992 0l-1.5-10zM8 9a1 1 0 100 2h4a1 1 0 100-2H8z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
            </svg>
            Host
          </span>
        {/if}
      </li>
    {/each}
    
    {#if players.length < maxPlayers}
      {#each Array(maxPlayers - players.length) as _}
        <li class="p-2 rounded-md border border-dashed border-gray-200 text-center text-gray-400 text-sm">
          Waiting for player...
        </li>
      {/each}
    {/if}
  </ul>
</div>
