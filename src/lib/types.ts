export interface Player {
  id: number;
  name: string;
  isHost: boolean;
}

export interface GameMode {
  id: string;
  name: string;
}

export interface Playlist {
  id: number;
  name: string;
  imageUrl: string;
  songCount: number;
}

export interface Settings {
  maxPlayers: number;
  gameMode: string;
  selectedPlaylistId: number;
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}
