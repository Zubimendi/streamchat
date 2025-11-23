import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRoomModal({ onClose, onCreated }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Room name is required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/rooms', {
        name: name.trim(),
        description: description.trim(),
        type,
      });
      toast.success('Room created successfully!');
      onCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
            Create Room
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="general"
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Room Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setType('public')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                  type === 'public'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setType('private')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                  type === 'private'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark'
                }`}
              >
                Private
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
