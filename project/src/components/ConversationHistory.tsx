import React from 'react';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  messages: Message[];
  isDark?: boolean;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ messages, isDark = true }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`flex max-w-xs lg:max-w-md ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            } items-start space-x-2`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? isDark
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                    : 'bg-gradient-to-r from-orange-500 to-orange-700'
                  : isDark
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
            >
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-2 ${
                message.type === 'user'
                  ? isDark
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-2'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-2'
                  : isDark
                    ? 'bg-white/10 backdrop-blur-sm text-white mr-2'
                    : 'bg-black/10 backdrop-blur-sm text-gray-800 mr-2'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === 'user' 
                    ? 'text-orange-100' 
                    : isDark 
                      ? 'text-blue-200' 
                      : 'text-blue-600'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationHistory;