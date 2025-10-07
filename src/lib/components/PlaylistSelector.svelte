<script lang="ts">
  import type { Playlist } from '$lib/types';
  
  const props = $props<{
    playlists: Playlist[];
    selectedPlaylistId: number;
    onSelect: (id: number) => void;
  }>();
  
  let searchQuery = $state('');
  
  let filteredPlaylists = $derived(props.playlists.filter((playlist: Playlist) => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ));
</script>

<div class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
  <h2 class="text-xl font-semibold text-gray-800 mb-4">Select Playlist</h2>
  
  <div class="mb-3">
    <input
      type="text"
      placeholder="Search playlists..."
      bind:value={searchQuery}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
    {#each filteredPlaylists as playlist (playlist.id)}
      <button 
        class="flex flex-col items-center text-left p-3 rounded-lg transition-all {props.selectedPlaylistId === playlist.id ? 'bg-blue-50 border-blue-200 border' : 'bg-gray-50 hover:bg-gray-100 border-gray-100 border'}"
        onclick={() => props.onSelect(playlist.id)}
      >
        <div class="w-full aspect-square mb-2 rounded-md overflow-hidden">
          <img 
            src={playlist.imageUrl} 
            alt={playlist.name}
            class="w-full h-full object-cover"
          />
        </div>
        <div class="w-full">
          <h3 class="font-medium text-gray-900 truncate">{playlist.name}</h3>
          <p class="text-sm text-gray-500">{playlist.songCount} songs</p>
        </div>
      </button>
    {/each}
    
    {#if filteredPlaylists.length === 0}
      <div class="col-span-3 py-8 text-center text-gray-500">
        No playlists found matching "{searchQuery}"
      </div>
    {/if}
  </div>
</div>
