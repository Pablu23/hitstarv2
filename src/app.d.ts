// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export interface User {
  email: string;
  username: string;
}
//
// export interface Player {
//   id: number;
//   name: string;
//   isHost: boolean;
// }

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

export interface GameSettings {
  maxPlayers: number;
  gameMode: string;
  selectedPlaylist: number;
}

export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};
