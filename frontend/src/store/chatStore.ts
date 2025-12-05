import { create } from 'zustand';
import { type Room, type Message, type User } from '../types';

interface ChatState {
  rooms: Room[];
  currentRoom: Room | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  setCurrentRoom: (room: Room | null) => void;
  
  setMessages: (roomId: string, messages: Message[]) => void;
  addMessage: (roomId: string, message: Message) => void;
  updateMessage: (roomId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (roomId: string, messageId: string) => void;
  
  setTypingUsers: (roomId: string, users: string[]) => void;
  addTypingUser: (roomId: string, userId: string) => void;
  removeTypingUser: (roomId: string, userId: string) => void;
  
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;

  addMember: (user: User) => void;
  removeMember: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  currentRoom: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),

  setRooms: (rooms) => set({ rooms }),
  
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  
  setCurrentRoom: (room) => set(() => {
    const onlineUsers = new Set<string>();
    if (room) {
      room.members.forEach((member) => {
        if (member.status === 'online') {
          onlineUsers.add(member.id);
        }
      });
    }
    return { currentRoom: room, onlineUsers };
  }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  updateMessage: (roomId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: state.messages[roomId]?.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      },
    })),

  deleteMessage: (roomId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: state.messages[roomId]?.filter((msg) => msg.id !== messageId),
      },
    })),

  setTypingUsers: (roomId, users) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [roomId]: users },
    })),

  addTypingUser: (roomId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [roomId]: [...(state.typingUsers[roomId] || []), userId],
      },
    })),

  removeTypingUser: (roomId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [roomId]: state.typingUsers[roomId]?.filter((id) => id !== userId) || [],
      },
    })),

  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),

  removeOnlineUser: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),

  addMember: (user) =>
    set((state) => {
      if (!state.currentRoom) return {};
      // Check if member already exists
      if (state.currentRoom.members.some((m) => m.id === user.id)) return {};
      
      const members = [...state.currentRoom.members, user];
      const onlineUsers = new Set(state.onlineUsers);
      if (user.status === 'online') {
        onlineUsers.add(user.id);
      }
      return {
        currentRoom: { ...state.currentRoom, members },
        onlineUsers,
      };
    }),

  removeMember: (userId) =>
    set((state) => {
      if (!state.currentRoom) return {};
      const members = state.currentRoom.members.filter((m) => m.id !== userId);
      const onlineUsers = new Set(state.onlineUsers);
      onlineUsers.delete(userId);
      return {
        currentRoom: { ...state.currentRoom, members },
        onlineUsers,
      };
    }),
}));