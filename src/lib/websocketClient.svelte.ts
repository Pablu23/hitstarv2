import type { Settings, User, WebSocketMessage } from '../app';

export class WebsocketClient {
  connected = $state(false);
  players: User[] = $state([]);
  gameSettings: Settings = $state({
    maxPlayers: 8,
    gameMode: 'classic',
    selectedPlaylistId: ''
  });
  socket: WebSocket | null = null;
  onGameStart: () => void = () => {};

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
            this.players = this.players.filter((p) => p.email !== message.email);
            break;

          case 'playerList':
            this.players = message.players;
            break;

          case 'settingsUpdate':
            this.gameSettings = message.settings;
            break;

          case 'startGame':
            this.onGameStart()
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
