import { Response } from "express";
import { Message } from "../models/message.model.js";
import { DirectMessage } from "../models/directmessage.model.js";
import { Room } from "../models/room.model.js";
import { AuthRequest } from "../types/index.js";

export const getRoomMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "50" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Check room access
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.type === "private" && !room.members.includes(req.userId as any)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({ roomId: id })
      .populate("senderId", "username avatar status")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ roomId: id });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, type = "text", fileUrl, replyTo } = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Message content required" });
    }

    const message = await Message.create({
      roomId: id,
      senderId: req.userId,
      content,
      type,
      fileUrl,
      replyTo: replyTo || null,
    });

    const populatedMessage = await message.populate([
      { path: "senderId", select: "username avatar status" },
      { path: "replyTo" },
    ]);

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const editMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: "Can only edit own messages" });
    }

    // Check if message is older than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (message.createdAt < fiveMinutesAgo) {
      return res
        .status(400)
        .json({ error: "Cannot edit messages older than 5 minutes" });
    }

    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({ update_message: "Message updated", message });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ error: "Failed to edit message" });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: "Can only delete own messages" });
    }

    await message.deleteOne();

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

export const addReaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === req.userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        (r) => !(r.userId.toString() === req.userId && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        userId: req.userId as any,
      });
    }

    await message.save();

    res.json({ message: "Reaction updated", reactions: message.reactions });
  } catch (error) {
    console.error("Add reaction error:", error);
    res.status(500).json({ error: "Failed to add reaction" });
  }
};

export const searchMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { q, roomId } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search query required" });
    }

    const query: any = {
      content: { $regex: q, $options: "i" },
    };

    if (roomId) {
      query.roomId = roomId;
    }

    const messages = await Message.find(query)
      .populate("senderId", "username avatar")
      .populate("roomId", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ messages });
  } catch (error) {
    console.error("Search messages error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

export const getDirectMessages = async (req: AuthRequest, res: Response) => {
  try {
    // Get all unique conversations
    const conversations = await DirectMessage.aggregate([
      {
        $match: {
          participants: { $in: [req.userId] },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$participants",
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error("Get DMs error:", error);
    res.status(500).json({ error: "Failed to get conversations" });
  }
};

export const getDirectMessageHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { page = "1", limit = "50" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const messages = await DirectMessage.find({
      participants: { $all: [req.userId, userId] },
    })
      .populate("senderId", "username avatar status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await DirectMessage.countDocuments({
      participants: { $all: [req.userId, userId] },
    });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get DM history error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const sendDirectMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { content, type = "text", fileUrl } = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Message content required" });
    }

    const message = await DirectMessage.create({
      participants: [req.userId, userId],
      senderId: req.userId,
      content,
      type,
      fileUrl,
    });

    const populatedMessage = await message.populate(
      "senderId",
      "username avatar status"
    );

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Send DM error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
