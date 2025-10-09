import type { Player, Settings, WebSocketMessage } from './types';

export class WebsocketClient {
  connected = $state(false);
  players: Player[] = $state([]);
  gameSettings: Settings = $state({
    maxPlayers: 8,
    gameMode: 'classic',
    selectedPlaylistId: 1
  });
  socket: WebSocket | null = null;

  connect(url: string): void {
    if (this.socket) this.socket.close();

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to websocket');
      this.connected = true;
    };

    this.socket.onclose = () => {
      this.connected = false;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;

        console.log(`Received message ${JSON.stringify(message)}`);

        switch (message.type) {
          case 'playerJoin':
            this.players = [...this.players, message.player];
            break;

          case 'playerLeave':
            this.players = this.players.filter((p) => p.id !== message.playerId);
            break;

          case 'playerList':
            this.players = message.players;
            break;

          case 'settingsUpdate':
            this.gameSettings = message.settings;
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connected = false;
    this.players = [];
  }
}

export const wsClient = new WebsocketClient();

//
// export function createWebSocketClient() {
//   let socket: WebSocket | null = null;
//
//   let connected = false;
//   let players: Player[] = [];
//   let gameSettings: Settings = {
//     maxPlayers: 8,
//     gameMode: 'classic',
//     selectedPlaylistId: 1
//   };
//
//   function connect(url: string): void {
//     if (socket) socket.close();
//
//     socket = new WebSocket(url);
//
//     socket.onopen = () => {
//       console.log('Connected to websocket');
//       connected = true;
//     };
//
//     socket.onclose = () => {
//       connected = false;
//     };
//
//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//
//     socket.onmessage = (event: MessageEvent) => {
//       try {
//         const message = JSON.parse(event.data) as WebSocketMessage;
//
//         console.log(`Received message ${JSON.stringify(message)}`);
//
//         switch (message.type) {
//           case 'playerJoin':
//             players = [...players, message.player];
//             break;
//
//           case 'playerLeave':
//             players = players.filter((p) => p.id !== message.playerId);
//             break;
//
//           case 'playerList':
//             players = message.players;
//             break;
//
//           case 'settingsUpdate':
//             gameSettings = message.settings;
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };
//   }
//
//   function sendMessage(message: WebSocketMessage): void {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(message));
//     } else {
//       console.warn('Cannot send message, WebSocket is not connected');
//     }
//   }
//
//   function disconnect(): void {
//     if (socket) {
//       socket.close();
//       socket = null;
//     }
//     connected = false;
//     players = [];
//   }
//
//   return {
//     connected: connected,
//     players: players,
//     gameSettings: gameSettings,
//     connect: connect,
//     sendMessage: sendMessage,
//     disconnect: disconnect
//   };
// }
