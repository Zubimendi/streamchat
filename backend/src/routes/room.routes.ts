import { Router } from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  getRoomMembers
} from '../controllers/room.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const roomRoutes = Router();

// All routes require authentication
roomRoutes.use(verifyToken);

roomRoutes.post('/', createRoom);
roomRoutes.get('/', getRooms);
roomRoutes.get('/:id', getRoomById);
roomRoutes.put('/:id', updateRoom);
roomRoutes.delete('/:id', deleteRoom);
roomRoutes.post('/:id/join', joinRoom);
roomRoutes.post('/:id/leave', leaveRoom);
roomRoutes.get('/:id/members', getRoomMembers);

export default roomRoutes;