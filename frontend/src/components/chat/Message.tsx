import React from 'react';
import type { ChatMessage } from '../../types/chat';

interface MessageProps {
  message: ChatMessage;
  isUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-500 text-white rounded-br-sm' 
          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
      }`}>
        
        {/* Message content */}
        <div className="text-sm leading-relaxed">
          {isUser ? (
            <p>{message.question}</p>
          ) : (
            <div>
              <p className="whitespace-pre-wrap">{message.answer}</p>
              
              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Sources:</p>
                  <div className="space-y-1">
                    {message.citations.map((citation, index) => (
                      <a
                        key={index}
                        href={citation.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {citation.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-1 ${
          isUser ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {/* Metadata for AI messages */}
        {!isUser && message.metadata && (
          <div className="text-xs text-gray-400 mt-1">
            {message.metadata.processing_time > 0 && (
              <span>⏱️ {message.metadata.processing_time.toFixed(1)}s</span>
            )}
            {message.metadata.api_calls?.pretge_token_api && (
              <span className="ml-2">📊 Real data</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
