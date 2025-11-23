import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
  rooms: string[];
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}