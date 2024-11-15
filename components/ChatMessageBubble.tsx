'use client';

import { Message } from 'ai';

export function ChatMessageBubble({ message, aiEmoji, sources }: { message: Message; aiEmoji?: string; sources?: any[] }) {
  const isUser = message.role === 'user';

  return (
    <div className={`group flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
      {/* Avatar/Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
        ${isUser ? 'order-2 ml-3 bg-indigo-500/20' : 'order-1 mr-3 bg-slate-500/20'}`}>
        <span className="text-sm">{isUser ? '👤' : aiEmoji}</span>
      </div>

      {/* Message Content */}
      <div className={`relative max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
        <div className={`p-4 rounded-2xl backdrop-blur-sm transform transition-all duration-300
          ${isUser 
            ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 hover:shadow-indigo-500/10' 
            : 'bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:shadow-slate-500/10'
          }
          hover:shadow-lg hover:-translate-y-0.5
          ${isUser ? 'hover:bg-indigo-500/20' : 'hover:bg-slate-800/70'}
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Sources section if available */}
          {sources && sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <p className="text-xs text-slate-400 mb-2">Sources:</p>
              <ul className="space-y-2">
                {sources.map((source, i) => (
                  <li key={i} className="text-xs text-slate-400 hover:text-indigo-300 transition-colors">
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}