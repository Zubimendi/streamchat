import { useState } from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">
            Create Room
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="general"
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Room Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setType('public')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition font-medium ${
                  type === 'public'
                    ? 'border-white bg-white text-primary'
                    : 'border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setType('private')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition font-medium ${
                  type === 'private'
                    ? 'border-white bg-white text-primary'
                    : 'border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                Private
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 bg-white text-primary rounded-lg font-bold hover:bg-white/90 transition disabled:opacity-50 shadow-lg mt-2"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
