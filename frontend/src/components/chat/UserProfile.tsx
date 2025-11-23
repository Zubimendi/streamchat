import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface UserProfileProps {
  onClose: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user?.username[0].toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {user?.username}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {user?.email}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-text-light dark:text-text-dark capitalize">
                  {user?.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Bio
              </label>
              <p className="text-text-light dark:text-text-dark">
                {user?.bio || 'No bio yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}