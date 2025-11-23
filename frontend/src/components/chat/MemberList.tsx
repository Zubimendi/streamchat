import { useChatStore } from '../../store/chatStore';
import { type User } from '../../types';

export default function MemberList() {
  const { currentRoom, onlineUsers } = useChatStore();

  if (!currentRoom) {
    return null;
  }

  const onlineMembers = currentRoom.members.filter((member) =>
    onlineUsers.has(member.id)
  );
  const offlineMembers = currentRoom.members.filter(
    (member) => !onlineUsers.has(member.id)
  );

  return (
    <div className="h-full bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark overflow-y-auto">
      <div className="p-4">
        <h3 className="font-bold text-text-light dark:text-text-dark mb-4">
          Members — {currentRoom.members.length}
        </h3>

        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              ONLINE — {onlineMembers.length}
            </p>
            {onlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} online />
            ))}
          </div>
        )}

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2">
              OFFLINE — {offlineMembers.length}
            </p>
            {offlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} online={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberItem({ member, online }: { member: User; online: boolean }) {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition mb-1">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
          {member.username[0].toUpperCase()}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-light dark:border-surface-dark ${
            online ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <span className="text-sm text-text-light dark:text-text-dark">
        {member.username}
      </span>
    </div>
  );
}