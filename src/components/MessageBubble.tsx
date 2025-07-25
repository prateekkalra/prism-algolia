import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { ChatMessage } from '../types/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copiedBlocks, setCopiedBlocks] = React.useState<Set<number>>(new Set());

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set(prev).add(index));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const renderFormattedContent = (content: string) => {
    // Simple markdown-like parsing for demo purposes
    let formattedContent = content;
    
    // Handle code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let codeBlockIndex = 0;
    formattedContent = formattedContent.replace(codeBlockRegex, (match, language, code) => {
      const blockIndex = codeBlockIndex++;
      const isCopied = copiedBlocks.has(blockIndex);
      
      return `<div class="code-block-container">
        <div class="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
          <span class="text-xs text-gray-400 font-mono">${language || 'code'}</span>
          <button onclick="handleCopyCode(\`${code.trim()}\`, ${blockIndex})" class="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 rounded transition-colors">
            ${isCopied ? '<svg class="w-3 h-3"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg>' : '<svg class="w-3 h-3"><rect width="8" height="8" x="3" y="3" rx="1" ry="1" stroke="currentColor" stroke-width="2" fill="none"/><path d="M11 3h4a2 2 0 0 1 2 2v4" stroke="currentColor" stroke-width="2" fill="none"/></svg>'}
            ${isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre class="bg-gray-900 p-4 rounded-b-lg overflow-x-auto"><code class="text-sm text-gray-300 font-mono">${code.trim()}</code></pre>
      </div>`;
    });

    // Handle inline code
    formattedContent = formattedContent.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300">$1</code>');
    
    // Handle bold text
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>');
    
    // Handle italic text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>');
    
    // Handle tables (basic)
    const tableRegex = /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)+)/g;
    formattedContent = formattedContent.replace(tableRegex, (match, headers, rows) => {
      const headerCells = headers.split('|').map(cell => cell.trim()).filter(cell => cell);
      const rowCells = rows.split('\n').filter(row => row.trim()).map(row => 
        row.split('|').map(cell => cell.trim()).filter(cell => cell)
      );
      
      return `<div class="overflow-x-auto my-4">
        <table class="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead class="bg-gray-800">
            <tr>
              ${headerCells.map(header => `<th class="px-4 py-2 text-left text-sm font-semibold text-gray-200 border-b border-gray-700">${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowCells.map(row => `<tr class="border-b border-gray-800 hover:bg-gray-800/30">
              ${row.map(cell => `<td class="px-4 py-2 text-sm text-gray-300">${cell}</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    });

    return { __html: formattedContent };
  };

  const isUser = message.type === 'user';

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-800'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-blue-400" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-800/50 text-gray-200 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed font-medium">{message.content}</p>
          ) : (
            <div 
              className="text-sm leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={renderFormattedContent(message.content)}
            />
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.isStreaming && (
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;