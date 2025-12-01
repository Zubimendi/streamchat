import { io, Socket } from 'socket.io-client';
import { type Message } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Room events
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave_room', roomId);
  }

  // Message events
  sendMessage(roomId: string, content: string, replyTo?: string) {
    this.socket?.emit('send_message', {
      roomId,
      content,
      type: 'text',
      replyTo,
    });
  }

  sendDirectMessage(recipientId: string, content: string) {
    this.socket?.emit('send_dm', {
      recipientId,
      content,
      type: 'text',
    });
  }

  editMessage(messageId: string, content: string, roomId: string) {
    this.socket?.emit('edit_message', {
      messageId,
      content,
      roomId,
    });
  }

  deleteMessage(messageId: string, roomId: string) {
    this.socket?.emit('delete_message', {
      messageId,
      roomId,
    });
  }

  addReaction(messageId: string, emoji: string, roomId: string) {
    this.socket?.emit('add_reaction', {
      messageId,
      emoji,
      roomId,
    });
  }

  // Typing indicators
  startTyping(roomId: string) {
    this.socket?.emit('typing_start', roomId);
  }

  stopTyping(roomId: string) {
    this.socket?.emit('typing_stop', roomId);
  }

  // Status
  updateStatus(status: 'online' | 'away' | 'dnd') {
    this.socket?.emit('user_status', status);
  }

  // Event listeners
  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageEdited(callback: (data: any) => void) {
    this.socket?.on('message_edited', callback);
  }

  onMessageDeleted(callback: (data: any) => void) {
    this.socket?.on('message_deleted', callback);
  }

  onUserTyping(callback: (data: any) => void) {
    this.socket?.on('user_typing', callback);
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    this.socket?.on('user_stopped_typing', callback);
  }

  onUserOnline(callback: (data: any) => void) {
    this.socket?.on('user_online', callback);
  }

  onUserOffline(callback: (data: any) => void) {
    this.socket?.on('user_offline', callback);
  }

  onUserJoined(callback: (data: any) => void) {
    this.socket?.on('user_joined', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    this.socket?.on('user_left', callback);
  }

  // Remove listeners
  off(event: string) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();
