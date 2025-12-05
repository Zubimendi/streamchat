import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { socketService } from '../../services/socket.service';

interface MessageInputProps {
  roomId: string;
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        socketService.stopTyping(roomId);
      }
    };
  }, [roomId]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.startTyping(roomId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.stopTyping(roomId);
    }, 2000);
  };

  const handleSend = () => {
    if (message.trim()) {
      socketService.sendMessage(roomId, message.trim());
      setMessage('');
      setIsTyping(false);
      socketService.stopTyping(roomId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="flex items-end space-x-2">
        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Paperclip className="w-5 h-5 text-white/60 hover:text-white" />
        </button>

        <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 focus-within:ring-2 focus-within:ring-white/30 transition">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none resize-none"
            style={{ maxHeight: '120px' }}
          />
        </div>

        <button className="p-2 hover:bg-white/10 rounded-lg transition">
          <Smile className="w-5 h-5 text-white/60 hover:text-white" />
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-white text-primary rounded-full hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}