import type { Player, Settings, WebSocketMessage } from './types';

export function createWebSocketClient() {
  let socket: WebSocket | null = null;

  let connected = false;
  let players: Player[] = [];
  let gameSettings: Settings = {
    maxPlayers: 8,
    gameMode: 'classic',
    selectedPlaylistId: 1
  };

  function connect(url: string): void {
    if (socket) socket.close();

    socket = new WebSocket(url);

    socket.onopen = () => {
      connected = true;
    };

    socket.onclose = () => {
      connected = false;
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;

        switch (message.type) {
          case 'playerJoin':
            players = [...players, message.player];
            break;

          case 'playerLeave':
            players = players.filter(p => p.id !== message.playerId);
            break;

          case 'playerList':
            players = message.players;
            break;

          case 'settingsUpdate':
            gameSettings = message.settings;
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  function sendMessage(message: WebSocketMessage): void {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, WebSocket is not connected');
    }
  }

  function disconnect(): void {
    if (socket) {
      socket.close();
      socket = null;
    }
    connected = false;
    players = [];
  }

  return {
    connected,
    players,
    gameSettings,
    connect,
    sendMessage,
    disconnect
  };
}
