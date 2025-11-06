import React from 'react';
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';
import { formatTimestamp, truncateText } from '../../utils/formatters';

function ConversationList() {
  const { state, switchSession, deleteSession } = useChat();

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteSession(sessionId);
    }
  };

  if (state.sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FiMessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No conversations yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Start a new chat to begin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-4">
      {state.sessions.map((session) => (
        <div
          key={session.session_id}
          onClick={() => switchSession(session.session_id)}
          className={`group relative rounded-xl p-4 cursor-pointer transition-all ${
            state.currentSession === session.session_id
              ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/20 border-2 border-blue-300 dark:border-blue-600 shadow-md'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold truncate ${
                state.currentSession === session.session_id
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {truncateText(session.title || 'New Conversation', 30)}
              </h3>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs font-medium ${
                  state.currentSession === session.session_id
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTimestamp(session.updated_at)}
                </span>
                
                {session.message_count > 0 && (
                  <span className={`text-xs font-medium ${
                    state.currentSession === session.session_id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    • {session.message_count} messages
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={(e) => handleDelete(e, session.session_id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:scale-110"
              aria-label="Delete conversation"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
