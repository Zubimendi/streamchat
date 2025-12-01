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
    <div className="h-full bg-white/10 backdrop-blur-lg border-l border-white/20 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-bold text-white mb-4">
          Members — {currentRoom.members.length}
        </h3>

        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-white/60 mb-2">
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
            <p className="text-xs font-semibold text-white/60 mb-2">
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
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition mb-1">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center text-sm font-bold shadow-sm">
          {member.username[0].toUpperCase()}
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white/20 ${
            online ? 'bg-green-400' : 'bg-white/40'
          }`}
        />
      </div>
      <span className="text-sm text-white">
        {member.username}
      </span>
    </div>
  );
}