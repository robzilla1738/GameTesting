import { create } from "zustand";

interface WebSocketStore {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
  subscribeToGame: (gameId: number) => void;
  sendScore: (score: number) => void;
}

export const useWebSocket = create<WebSocketStore>((set, get) => ({
  socket: null,
  
  connect: () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      set({ socket: null });
    };
    
    set({ socket });
  },
  
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
  
  subscribeToGame: (gameId: number) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "subscribe_game", gameId }));
    }
  },
  
  sendScore: (score: number) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "new_score", score }));
    }
  },
}));
