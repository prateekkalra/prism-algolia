import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { ChatMessage } from './types/types';
import { FileAnalysisPane } from './components/FileAnalysisPane';
import ChatPane from './components/ChatPane';
import Navbar from './components/Navbar';
import { sendMessageToMoonshot, convertChatMessagesToMoonshotFormat, MoonshotResponse } from './services/moonshot';
import { LocalStorageService } from './services/localStorage';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelSizes, setPanelSizes] = useState({ left: 35, right: 65 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const initialSizes = useRef({ left: 35, right: 65 });

  // Helper function to detect if message might reference file data
  const detectSourceReference = useCallback((userMessage: string, aiResponse: string) => {
    const analyses = LocalStorageService.getAllAnalyses();
    console.log('🔍 Source Detection Debug:');
    console.log('- Available analyses:', analyses.length);
    console.log('- User message:', userMessage);
    console.log('- AI response preview:', aiResponse.substring(0, 100) + '...');
    
    if (analyses.length === 0) {
      console.log('❌ No analyses available');
      return undefined;
    }

    // Expanded keyword list for better detection
    const fileKeywords = [
      'file', 'document', 'data', 'analyze', 'content', 'pdf', 'text', 'upload', 'uploaded',
      'csv', 'json', 'excel', 'word', 'docx', 'txt', 'image', 'video', 'audio',
      'analysis', 'report', 'summary', 'information', 'details', 'what', 'tell me about'
    ];
    
    const hasFileReference = fileKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword) || 
      aiResponse.toLowerCase().includes(keyword)
    );
    
    console.log('- Has file reference:', hasFileReference);
    
    if (hasFileReference && analyses.length > 0) {
      const sourceId = analyses[0].id;
      console.log('✅ Linking to source:', sourceId, '- File:', analyses[0].fileName);
      return sourceId;
    }
    
    console.log('❌ No source link created');
    return undefined;
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content,
      timestamp: new Date(),
      isComplete: true
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create AI message for streaming
    const aiMessageId = Math.random().toString(36).substr(2, 9);
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      isComplete: false
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Convert messages to Moonshot format (excluding the current streaming message)
      const conversationHistory = [...messages, userMessage];
      const moonshotMessages = convertChatMessagesToMoonshotFormat(conversationHistory);

      // Send to Moonshot with streaming
      const response: MoonshotResponse = await sendMessageToMoonshot(
        moonshotMessages,
        (chunk: string) => {
          // Update the streaming message with new chunk
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );

      // Handle source information from Algolia
      let sourceRecordId = undefined;
      if (response.sourceInfo) {
        // Create StoredAnalysis record from Algolia data
        const algoliaAnalysis = {
          id: `algolia_${response.sourceInfo.objectId}`,
          fileName: response.sourceInfo.fileName,
          fileType: response.sourceInfo.fileType === 'document' ? 'PDF' : 
                   response.sourceInfo.fileType === 'text' ? 'Text' :
                   response.sourceInfo.fileType === 'image' ? 'Image' :
                   response.sourceInfo.fileType === 'video' ? 'Video' :
                   response.sourceInfo.fileType === 'audio' ? 'Audio' : 'Unknown',
          fileSize: response.sourceInfo.fileSize,
          description: response.sourceInfo.description,
          analysisDate: new Date(response.sourceInfo.uploadDate)
        };
        
        // Save to localStorage for reference display
        LocalStorageService.saveStoredAnalysis(algoliaAnalysis);
        sourceRecordId = algoliaAnalysis.id;
        
        console.log('📎 Created source record from Algolia:', sourceRecordId, '- File:', algoliaAnalysis.fileName);
      } else {
        // Fallback to existing detection method
        sourceRecordId = detectSourceReference(content, response.content);
      }
      

      // Mark message as complete and add source reference if detected
      console.log('💬 Setting sourceRecordId for message:', aiMessageId, '- Source ID:', sourceRecordId);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              isStreaming: false, 
              isComplete: true,
              sourceRecordId: sourceRecordId
            }
          : msg
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update with error message
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              content: 'Sorry, I encountered an error while processing your request. Please check your connection and try again.',
              isStreaming: false,
              isComplete: true
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, detectSourceReference]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);


  const handleExportChat = useCallback(() => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prism-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    initialSizes.current = { ...panelSizes };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartX.current;
    const deltaPercent = (deltaX / containerRect.width) * 100;
    
    const newLeftSize = Math.max(20, Math.min(60, initialSizes.current.left + deltaPercent));
    const newRightSize = 100 - newLeftSize;
    
    setPanelSizes({ left: newLeftSize, right: newRightSize });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="h-screen bg-gray-900 text-white overflow-hidden select-none flex flex-col"
    >
      {/* Top Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel - File Analysis Pane */}
        <div 
          className="flex-shrink-0 transition-all duration-200 ease-out"
          style={{ width: `${panelSizes.left}%` }}
        >
          <FileAnalysisPane />
        </div>

        {/* Resizable Divider */}
        <div 
          className={`w-1 bg-gray-800 hover:bg-gray-700 cursor-col-resize flex items-center justify-center group transition-all duration-200 ${
            isDragging ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className={`w-5 h-12 bg-gray-700 group-hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDragging ? 'bg-blue-500 scale-110' : ''
          }`}>
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        {/* Right Panel - Chat Pane */}
        <div 
          className="flex-1 transition-all duration-200 ease-out"
          style={{ width: `${panelSizes.right}%` }}
        >
          <ChatPane
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;