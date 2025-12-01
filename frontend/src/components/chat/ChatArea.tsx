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
      <div className="flex-1 flex items-center justify-center bg-transparent">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
          <Hash className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to StreamChat
          </h2>
          <p className="text-white/70">
            Select a room to start chatting
          </p>
        </div>
      </div>
    );
  }

  const roomMessages = messages[currentRoom.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      {/* Header */}
      <div className="h-16 bg-white/10 backdrop-blur-lg border-b border-white/20 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <Hash className="w-5 h-5 text-white/60" />
          <div>
            <h2 className="font-bold text-white">
              {currentRoom.name}
            </h2>
            <p className="text-xs text-white/70">
              {currentRoom.description || 'No description'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMemberList}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition"
        >
          <Users className="w-5 h-5 text-white/60" />
          <span className="text-sm text-white">
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