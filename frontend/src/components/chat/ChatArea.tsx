import { useEffect, useState } from 'react';
import { Menu, Hash, Users } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useUIStore } from '../../store/uiStore';
import { socketService } from '../../services/socket.service';
import api from '../../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import toast from 'react-hot-toast';

interface ChatAreaProps {
  roomId?: string;
}

export default function ChatArea({ roomId }: ChatAreaProps) {
  const { currentRoom, messages, setMessages, setCurrentRoom } = useChatStore();
  const { toggleSidebar, toggleMemberList } = useUIStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roomId && roomId !== currentRoom?.id) {
      loadRoom(roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom.id);
      socketService.joinRoom(currentRoom.id);

      return () => {
        socketService.leaveRoom(currentRoom.id);
      };
    }
  }, [currentRoom]);

  const loadRoom = async (id: string) => {
    try {
      const { data } = await api.get(`/rooms/${id}`);
      setCurrentRoom(data.room);
    } catch (error) {
      toast.error('Failed to load room');
    }
  };

  const loadMessages = async (roomId: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/messages/rooms/${roomId}/messages`);
      setMessages(roomId, data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            Welcome to StreamChat
          </h2>
          <p className="text-gray-500 dark:text-gray-500">
            Select a room to start chatting
          </p>
        </div>
      </div>
    );
  }

  const roomMessages = messages[currentRoom.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-text-light dark:text-text-dark" />
          </button>
          <Hash className="w-5 h-5 text-gray-400" />
          <div>
            <h2 className="font-bold text-text-light dark:text-text-dark">
              {currentRoom.name}
            </h2>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {currentRoom.description || 'No description'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMemberList}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
        >
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-text-light dark:text-text-dark">
            {currentRoom.members.length}
          </span>
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={roomMessages} loading={loading} />

      {/* Input */}
      <MessageInput roomId={currentRoom.id} />
    </div>
  );
}