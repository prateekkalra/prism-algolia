import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage, StoredAnalysis } from '../types/types';
import MessageSourceReference from './MessageSourceReference';

interface MessageBubbleProps {
  message: ChatMessage;
  sourceAnalysis?: StoredAnalysis;
  onViewSourceDetails?: (analysis: StoredAnalysis) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sourceAnalysis, onViewSourceDetails }) => {
  const isUser = message.type === 'user';
  
  const formatContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        {/* Source Reference - only show for AI messages with source */}
        {!isUser && sourceAnalysis && onViewSourceDetails && (
          <>
            {console.log('🎯 Rendering MessageSourceReference for:', sourceAnalysis.fileName)}
            <MessageSourceReference
              analysis={sourceAnalysis}
              onClick={() => onViewSourceDetails(sourceAnalysis)}
            />
          </>
        )}
        {!isUser && !sourceAnalysis && console.log('❌ No source analysis for AI message')}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-gray-800 text-gray-100'
          }`}
        >
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
          
          {/* Streaming indicator */}
          {message.isStreaming && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Moonshot AI is typing...</span>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;