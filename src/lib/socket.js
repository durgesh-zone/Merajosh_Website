import { io } from 'socket.io-client';
import { APP_NAME } from './api';

let socket = null;

/** Lazily opens the realtime connection (cookies authenticate it). */
export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || '/', {
      path: '/socket.io',
      withCredentials: true,
      auth: { app: APP_NAME },
      autoConnect: true,
      reconnectionDelayMax: 10000,
    });
  }
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
