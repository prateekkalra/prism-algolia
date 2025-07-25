import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, RotateCcw, Download, MessageSquare, BarChart3, FileSearch, TrendingUp } from 'lucide-react';
import { ChatMessage, ExamplePrompt } from '../types/types';
import MessageBubble from './MessageBubble';

interface ChatPaneProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  isLoading: boolean;
}

const ChatPane: React.FC<ChatPaneProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onExportChat,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const examplePrompts: ExamplePrompt[] = [
    {
      id: '1',
      text: 'Summarize the main points from quarterly-report.pdf',
      icon: 'FileSearch'
    },
    {
      id: '2',
      text: 'What is the total revenue in sales-data.csv?',
      icon: 'BarChart3'
    },
    {
      id: '3',
      text: 'Compare the findings in report-A.docx and report-B.docx',
      icon: 'TrendingUp'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const getExampleIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSearch':
        return <FileSearch className="w-4 h-4" />;
      case 'BarChart3':
        return <BarChart3 className="w-4 h-4" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-slate-900/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src="/prism-logo.svg" alt="Prism" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-white">Prism</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onExportChat}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200"
            title="Export Conversation"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ask anything about your data</h2>
              <p className="text-gray-400 text-lg">Upload your files and start asking questions to get insights</p>
            </div>

            <div className="grid gap-3 w-full max-w-lg">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleExamplePrompt(prompt.text)}
                  className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group"
                >
                  <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                    {getExampleIcon(prompt.icon)}
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-slate-900/95 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3 bg-gray-800/50 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up, or start a new query... (use / for commands)"
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none min-h-[20px] max-h-[120px] py-2 px-2 font-mono text-sm leading-relaxed"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Square className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPane;