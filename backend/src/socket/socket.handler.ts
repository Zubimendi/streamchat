import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Message } from '../models/message.model.js';
import { DirectMessage } from '../models/directmessage.model.js';
import { User } from '../models/user.model.js';
import { JWTPayload } from '../types/index.js';

// Store online users
const onlineUsers = new Map<string, string>(); // userId -> socketId
const typingUsers = new Map<string, Set<string>>(); // roomId -> Set<userId>

export const initializeSocket = (io: Server) => {
  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      socket.data.userId = decoded.userId;
      socket.data.username = decoded.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`✅ User connected: ${socket.data.username} (${socket.id})`);

    // Store user connection
    onlineUsers.set(userId, socket.id);

    // Update user status to online
    await User.findByIdAndUpdate(userId, {
      status: 'online',
      lastSeen: new Date()
    });

    // Broadcast user online
    io.emit('user_online', {
      userId,
      username: socket.data.username
    });

    // Join room
    socket.on('join_room', async (roomId: string) => {
      socket.join(roomId);
      console.log(`👥 ${socket.data.username} joined room: ${roomId}`);

      // Notify room members
      socket.to(roomId).emit('user_joined', {
        userId,
        username: socket.data.username,
        roomId
      });
    });

    // Leave room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`👋 ${socket.data.username} left room: ${roomId}`);

      socket.to(roomId).emit('user_left', {
        userId,
        username: socket.data.username,
        roomId
      });
    });

    // Send message
    socket.on('send_message', async (data: {
      roomId: string;
      content: string;
      type?: 'text' | 'file' | 'image';
      fileUrl?: string;
      replyTo?: string;
    }) => {
      try {
        const message = await Message.create({
          roomId: data.roomId,
          senderId: userId,
          content: data.content,
          type: data.type || 'text',
          fileUrl: data.fileUrl,
          replyTo: data.replyTo
        });

        const populatedMessage = await message.populate([
          { path: 'senderId', select: 'username avatar status' },
          { path: 'replyTo' }
        ]);

        // Emit to all users in the room
        io.to(data.roomId).emit('new_message', populatedMessage);

        // Send delivery confirmation to sender
        socket.emit('message_delivered', {
          messageId: message._id,
          roomId: data.roomId
        });
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Send direct message
    socket.on('send_dm', async (data: {
      recipientId: string;
      content: string;
      type?: 'text' | 'file' | 'image';
      fileUrl?: string;
    }) => {
      try {
        const message = await DirectMessage.create({
          participants: [userId, data.recipientId],
          senderId: userId,
          content: data.content,
          type: data.type || 'text',
          fileUrl: data.fileUrl
        });

        const populatedMessage = await message.populate('senderId', 'username avatar status');

        // Send to recipient if online
        const recipientSocketId = onlineUsers.get(data.recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_dm', populatedMessage);
        }

        // Send confirmation to sender
        socket.emit('dm_sent', populatedMessage);
      } catch (error) {
        console.error('Send DM error:', error);
        socket.emit('error', { message: 'Failed to send DM' });
      }
    });

    // Typing indicator
    socket.on('typing_start', (roomId: string) => {
      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Set());
      }
      typingUsers.get(roomId)!.add(userId);

      socket.to(roomId).emit('user_typing', {
        userId,
        username: socket.data.username,
        roomId
      });
    });

    socket.on('typing_stop', (roomId: string) => {
      const roomTyping = typingUsers.get(roomId);
      if (roomTyping) {
        roomTyping.delete(userId);
      }

      socket.to(roomId).emit('user_stopped_typing', {
        userId,
        roomId
      });
    });

    // Edit message
    socket.on('edit_message', async (data: {
      messageId: string;
      content: string;
      roomId: string;
    }) => {
      try {
        const message = await Message.findById(data.messageId);

        if (!message || message.senderId.toString() !== userId) {
          return socket.emit('error', { message: 'Cannot edit this message' });
        }

        message.content = data.content;
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        io.to(data.roomId).emit('message_edited', {
          messageId: data.messageId,
          content: data.content,
          editedAt: message.editedAt
        });
      } catch (error) {
        console.error('Edit message error:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('delete_message', async (data: {
      messageId: string;
      roomId: string;
    }) => {
      try {
        const message = await Message.findById(data.messageId);

        if (!message || message.senderId.toString() !== userId) {
          return socket.emit('error', { message: 'Cannot delete this message' });
        }

        await message.deleteOne();

        io.to(data.roomId).emit('message_deleted', {
          messageId: data.messageId
        });
      } catch (error) {
        console.error('Delete message error:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Add reaction
    socket.on('add_reaction', async (data: {
      messageId: string;
      emoji: string;
      roomId: string;
    }) => {
      try {
        const message = await Message.findById(data.messageId);

        if (!message) {
          return socket.emit('error', { message: 'Message not found' });
        }

        // Toggle reaction
        const existingReaction = message.reactions.find(
          r => r.userId.toString() === userId && r.emoji === data.emoji
        );

        if (existingReaction) {
          message.reactions = message.reactions.filter(
            r => !(r.userId.toString() === userId && r.emoji === data.emoji)
          );
        } else {
          message.reactions.push({
            emoji: data.emoji,
            userId: userId as any
          });
        }

        await message.save();

        io.to(data.roomId).emit('reaction_added', {
          messageId: data.messageId,
          reactions: message.reactions
        });
      } catch (error) {
        console.error('Add reaction error:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Mark message as read
    socket.on('message_read', async (data: {
      messageId: string;
      roomId: string;
    }) => {
      try {
        await Message.findByIdAndUpdate(data.messageId, {
          $addToSet: { readBy: userId }
        });

        io.to(data.roomId).emit('message_read', {
          messageId: data.messageId,
          userId
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Update user status
    socket.on('user_status', async (status: 'online' | 'away' | 'dnd') => {
      try {
        await User.findByIdAndUpdate(userId, { status });

        io.emit('user_status_changed', {
          userId,
          status
        });
      } catch (error) {
        console.error('Update status error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.data.username}`);

      onlineUsers.delete(userId);

      // Remove from typing indicators
      typingUsers.forEach((users, roomId) => {
        if (users.has(userId)) {
          users.delete(userId);
          io.to(roomId).emit('user_stopped_typing', { userId, roomId });
        }
      });

      // Update user status to offline
      await User.findByIdAndUpdate(userId, {
        status: 'offline',
        lastSeen: new Date()
      });

      io.emit('user_offline', {
        userId,
        lastSeen: new Date()
      });
    });
  });

  console.log('✅ Socket.io initialized');
};