import { Router } from 'express';
import {
  getRoomMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  searchMessages,
  getDirectMessages,
  getDirectMessageHistory,
  sendDirectMessage
} from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const messageRoutes = Router();

// All routes require authentication
messageRoutes.use(verifyToken);

// Room messages
messageRoutes.get('/rooms/:id/messages', getRoomMessages);
messageRoutes.post('/rooms/:id/messages', sendMessage);
messageRoutes.put('/:id', editMessage);
messageRoutes.delete('/:id', deleteMessage);
messageRoutes.post('/:id/reactions', addReaction);
messageRoutes.get('/search', searchMessages);

// Direct messages
messageRoutes.get('/dms', getDirectMessages);
messageRoutes.get('/dms/:userId', getDirectMessageHistory);
messageRoutes.post('/dms/:userId', sendDirectMessage);

export default messageRoutes;
