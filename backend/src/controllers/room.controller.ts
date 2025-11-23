import { Response } from 'express';
import { Room } from '../models/room.model.js';
import { AuthRequest } from '../types/index.js';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
  type: z.enum(['public', 'private']),
  avatar: z.string().url().optional()
});

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const data = createRoomSchema.parse(req.body);

    const room = await Room.create({
      ...data,
      createdBy: req.userId,
      members: [req.userId],
      admins: [req.userId]
    });

    const populatedRoom = await room.populate('createdBy', 'username avatar');

    res.status(201).json({
      message: 'Room created',
      room: populatedRoom
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await Room.find({
      $or: [
        { type: 'public' },
        { members: req.userId }
      ]
    })
      .populate('createdBy', 'username avatar')
      .sort({ updatedAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to get rooms' });
  }
};

export const getRoomById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate('createdBy', 'username avatar')
      .populate('members', 'username avatar status')
      .populate('admins', 'username avatar');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user has access
    if (room.type === 'private' && !room.members.some(m => m._id.toString() === req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to get room' });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, avatar } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user is admin
    if (!room.admins.some(a => a.toString() === req.userId)) {
      return res.status(403).json({ error: 'Only admins can update room' });
    }

    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (avatar) room.avatar = avatar;

    await room.save();

    res.json({ message: 'Room updated', room });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Only creator can delete
    if (room.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can delete room' });
    }

    await room.deleteOne();

    res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.type === 'private') {
      return res.status(403).json({ error: 'Cannot join private room' });
    }

    if (room.members.includes(req.userId as any)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    room.members.push(req.userId as any);
    await room.save();

    res.json({ message: 'Joined room', room });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
};

export const leaveRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.members = room.members.filter(m => m.toString() !== req.userId);
    room.admins = room.admins.filter(a => a.toString() !== req.userId);

    await room.save();

    res.json({ message: 'Left room' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
};

export const getRoomMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id).populate('members', 'username avatar status lastSeen');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ members: room.members });
  } catch (error) {
    console.error('Get room members error:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
};