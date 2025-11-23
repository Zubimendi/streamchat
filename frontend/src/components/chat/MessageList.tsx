import { useEffect, useRef } from 'react';
import { type Message } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
// import { Edit2, Trash2, MoreVertical } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({ messages, loading }: MessageListProps) {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.senderId.id === user?.id;

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
              {!isOwnMessage && (
                <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">
                  {message.senderId.username}
                </span>
              )}
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? 'bg-primary text-white'
                    : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark'
                }`}
              >
                <p className="break-words">{message.content}</p>
              </div>
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                {message.edited && ' (edited)'}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}