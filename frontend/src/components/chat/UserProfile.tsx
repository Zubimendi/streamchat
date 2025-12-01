import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user } = useAuthStore();

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
              {user?.username[0].toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold text-white">
              {user?.username}
            </h3>
            <p className="text-white/70">
              {user?.email}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <span className="text-white capitalize font-medium">
                  {user?.status}
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="block text-sm font-medium text-white/60 mb-2">
                Bio
              </label>
              <p className="text-white">
                {user?.bio || 'No bio yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}