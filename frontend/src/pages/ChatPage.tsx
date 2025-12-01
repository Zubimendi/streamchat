import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { socketService } from '../services/socket.service';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import MemberList from '../components/chat/MemberList';
import { useUIStore } from '../store/uiStore';

export default function ChatPage() {
  const { roomId } = useParams();
  const { user } = useAuthStore();
  const { 
    addMessage, 
    addOnlineUser, 
    removeOnlineUser, 
    addTypingUser, 
    removeTypingUser,
    addMember,
    removeMember
  } = useChatStore();
  const { sidebarOpen, memberListOpen } = useUIStore();

  useEffect(() => {
    // Connect socket
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    // Listen for new messages
    socketService.onNewMessage((message) => {
      addMessage(message.roomId, message);
    });

    // Listen for user status
    socketService.onUserOnline((data) => {
      addOnlineUser(data.userId);
    });

    socketService.onUserOffline((data) => {
      removeOnlineUser(data.userId);
    });

    // Listen for room members
    socketService.onUserJoined(async (data) => {
      if (data.roomId === roomId) {
        try {
          const { data: userData } = await api.get(`/users/${data.userId}`);
          addMember(userData.user);
        } catch (error) {
          console.error('Failed to fetch joined user', error);
        }
      }
    });

    socketService.onUserLeft((data) => {
      if (data.roomId === roomId) {
        removeMember(data.userId);
      }
    });

    // Listen for typing indicators
    socketService.onUserTyping((data) => {
      if (data.userId !== user?.id) {
        addTypingUser(data.roomId, data.userId);
      }
    });

    socketService.onUserStoppedTyping((data) => {
      removeTypingUser(data.roomId, data.userId);
    });

    return () => {
      socketService.off('new_message');
      socketService.off('user_online');
      socketService.off('user_offline');
      socketService.off('user_joined');
      socketService.off('user_left');
      socketService.off('user_typing');
      socketService.off('user_stopped_typing');
    };
  }, [user, roomId]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden`}
      >
        <Sidebar />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea roomId={roomId} />
      </div>

      {/* Member List */}
      <div
        className={`${
          memberListOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden`}
      >
        <MemberList />
      </div>
    </div>
  );
}