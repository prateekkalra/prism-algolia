import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, MessageSquare, BarChart3, FileSearch, TrendingUp, Eye } from 'lucide-react';
import { ChatMessage, ExamplePrompt, StoredAnalysis } from '../types/types';
import MessageBubble from './MessageBubble';
import EntriWelcomeScreen from './EntriWelcomeScreen';
import { AnalysisDetailDialog } from './AnalysisDetailDialog';
import { LocalStorageService } from '../services/localStorage';

interface ChatPaneProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  showEntriMode?: boolean;
}

const ChatPane: React.FC<ChatPaneProps> = ({
  messages,
  onSendMessage,
  isLoading,
  showEntriMode = true
}) => {
  const [input, setInput] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<StoredAnalysis | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generalExamples: ExamplePrompt[] = [
    {
      id: '1',
      text: 'What tools do you have available?',
      icon: 'FileSearch'
    },
    {
      id: '2',
      text: 'Calculate 15 * 8 for me',
      icon: 'BarChart3'
    },
    {
      id: '3',
      text: 'What time is it right now?',
      icon: 'TrendingUp'
    }
  ];

  const entriExamples: ExamplePrompt[] = [
    {
      id: '1',
      text: 'Analyze customer acquisition trends from our latest campaign data',
      icon: 'TrendingUp',
      domain: 'entri',
      category: 'Analytics'
    },
    {
      id: '2',
      text: 'Compare conversion rates across different marketing channels',
      icon: 'BarChart3',
      domain: 'entri',
      category: 'Performance'
    },
    {
      id: '3',
      text: 'Generate insights from uploaded business reports',
      icon: 'FileSearch',
      domain: 'entri',
      category: 'Insights'
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

  const handleViewSourceDetails = (analysis: StoredAnalysis) => {
    setSelectedAnalysis(analysis);
    setIsDialogOpen(true);
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
        {messages.length === 0 ? (
          showEntriMode ? (
            <EntriWelcomeScreen onExampleClick={handleExamplePrompt} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">DataChat AI</h2>
                <p className="text-gray-400 text-lg">Ask questions, analyze data, and explore insights with advanced AI tools</p>
              </div>

              <div className="grid gap-3 w-full max-w-lg">
                {(showEntriMode ? entriExamples : generalExamples).map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleExamplePrompt(prompt.text)}
                    className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      {getExampleIcon(prompt.icon)}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {prompt.text}
                      </span>
                      {prompt.category && (
                        <div className="text-xs text-gray-500 mt-1">{prompt.category}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => {
              // Get source analysis if message has a source record ID
              const sourceAnalysis = message.sourceRecordId 
                ? LocalStorageService.getAnalysisById(message.sourceRecordId) || undefined
                : undefined;
              
              
              return (
                <MessageBubble 
                  key={message.id} 
                  message={message}
                  sourceAnalysis={sourceAnalysis}
                  onViewSourceDetails={handleViewSourceDetails}
                />
              );
            })}
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
              placeholder={showEntriMode ? "Ask about your business data and get insights..." : "Ask DataChat AI anything about your data..."}
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

      {/* Analysis Detail Dialog */}
      <AnalysisDetailDialog
        analysis={selectedAnalysis}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default ChatPane;