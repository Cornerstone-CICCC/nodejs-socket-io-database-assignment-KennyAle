import { Request, Response } from 'express';
import { Chat } from '../models/chat.model';

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 }); // Sort by createdAt field
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

const getMessagesByRoom = async (req: Request, res: Response) => {
  const { room } = req.params;

  try {
    const messages = await Chat.find({ room }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages by room' });
  }
};

export default {
  getAllChats,
  getMessagesByRoom
}