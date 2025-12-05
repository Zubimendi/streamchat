import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Hash } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserProfile from './chat/UserProfile';
import CreateRoomModal from './chat/CreateRoomModal';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rooms, setRooms } = useChatStore();
  const { theme, toggleTheme } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data.rooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-white/10 backdrop-blur-lg border-r border-white/20 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-white/20">
        <div
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
          onClick={() => setShowProfile(true)}
        >
          <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-lg">
            {user?.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">
              {user?.username}
            </p>
            <p className="text-xs text-white/70">
              {user?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Create Room Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowCreateRoom(true)}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition font-semibold shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => navigate(`/chat/${room.id}`)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition text-left group mb-3"
          >
            <Hash className="w-5 h-5 text-white/60 group-hover:text-white transition" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">
                {room.name}
              </p>
              <p className="text-xs text-white/60 truncate">
                {room.members.length} members
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full py-2 px-4 bg-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-500/20 text-red-200 rounded-lg text-sm font-medium hover:bg-red-500/30 transition"
        >
          Logout
        </button>
      </div>

      {/* Modals */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreated={loadRooms}
        />
      )}
    </div>
  );
}