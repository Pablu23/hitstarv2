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
  customMessageHandlers: ((message: WebSocketMessage) => void)[] = [];

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

        // First, handle built-in message types
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

        // Then, call all custom message handlers for additional handling
        this.customMessageHandlers.forEach(handler => handler(message));
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

  addMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.customMessageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.customMessageHandlers = this.customMessageHandlers.filter(h => h !== handler);
  }
}

export const wsClient = new WebsocketClient();
