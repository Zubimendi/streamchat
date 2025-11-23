import { useState, useEffect } from 'react';
import { Plus, Search, Hash, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserProfile from './chat/UserProfile';
import CreateRoomModal from './chat/CreateRoomModal';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { rooms, setRooms, setCurrentRoom } = useChatStore();
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
    <div className="h-full bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <div
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition"
          onClick={() => setShowProfile(true)}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {user?.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-light dark:text-text-dark">
              {user?.username}
            </p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {user?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Create Room Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowCreateRoom(true)}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
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
            onClick={() => setCurrentRoom(room)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition text-left"
          >
            <Hash className="w-5 h-5 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-light dark:text-text-dark truncate">
                {room.name}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                {room.members.length} members
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full py-2 px-4 bg-background-light dark:bg-background-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition"
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