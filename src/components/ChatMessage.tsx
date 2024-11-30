import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600' 
          : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
      }`}>
        {isUser ? <MessageCircle size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-6 py-3 shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white' 
          : 'bg-white border border-gray-100'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}