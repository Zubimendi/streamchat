export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
  lastSeen: Date;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  avatar?: string;
  createdBy: User;
  members: User[];
  admins: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: User;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  replyTo?: Message;
  reactions: Reaction[];
  edited: boolean;
  editedAt?: Date;
  readBy: string[];
  createdAt: Date;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  senderId: User;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  readBy: string[];
  createdAt: Date;
}
