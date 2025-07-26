import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { ChatMessage } from './types/types';
import { FileAnalysisPane } from './components/FileAnalysisPane';
import ChatPane from './components/ChatPane';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelSizes, setPanelSizes] = useState({ left: 35, right: 65 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const initialSizes = useRef({ left: 35, right: 65 });

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        content: generateMockResponse(content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 2000);
  }, []);

  const generateMockResponse = (query: string): string => {
    const responses = [
      `Based on your data analysis request, I can see you're looking for insights about "${query}". Here's what I found:

**Key Findings:**
- Data shows significant patterns in the uploaded files
- **Revenue Growth**: 15.3% increase quarter-over-quarter
- **Customer Retention**: 87% retention rate

\`\`\`sql
SELECT 
  quarter,
  SUM(revenue) as total_revenue,
  COUNT(DISTINCT customer_id) as unique_customers
FROM sales_data 
GROUP BY quarter
ORDER BY quarter DESC;
\`\`\`

Here's a summary table of the key metrics:

| Metric | Q1 2024 | Q2 2024 | Q3 2024 | Change |
|--------|---------|---------|---------|--------|
| Revenue | $125,000 | $144,000 | $166,000 | +15.3% |
| Customers | 1,250 | 1,380 | 1,455 | +5.4% |
| Avg Order | $100 | $104 | $114 | +9.6% |

*This analysis is based on the uploaded CSV data and processed through our AI models.*`,

      `I've analyzed your request about "${query}" and here are the insights:

The data reveals several interesting patterns. Let me break this down for you:

1. **Data Quality Assessment**: Your uploaded files show good data integrity
2. **Trend Analysis**: There's a clear upward trend in key performance indicators
3. **Recommendations**: Consider focusing on the top-performing segments

\`\`\`python
import pandas as pd
import numpy as np

# Sample analysis code
df = pd.read_csv('your_data.csv')
summary_stats = df.describe()
correlation_matrix = df.corr()

print("Summary Statistics:")
print(summary_stats)
\`\`\`

**Action Items:**
- Review the highlighted data points
- Consider implementing the suggested optimizations
- Monitor these metrics regularly

Would you like me to dive deeper into any specific aspect of this analysis?`,

      `Great question about "${query}"! I've processed your uploaded data and here's what stands out:

**Executive Summary:**
Your data contains valuable insights that can drive strategic decisions. The analysis shows consistent growth patterns with some areas for optimization.

**Detailed Breakdown:**

*Performance Metrics:*
- Overall performance: **Excellent** ✅
- Data completeness: **98.5%**
- Processing time: **2.3 seconds**

\`\`\`json
{
  "analysis_results": {
    "total_records": 15420,
    "data_quality_score": 9.2,
    "key_insights": [
      "Strong seasonal trends identified",
      "Customer segmentation opportunities",
      "Revenue optimization potential"
    ]
  }
}
\`\`\`

The most important finding is that your data shows a **strong correlation** between customer engagement and revenue growth. This suggests that focusing on customer experience initiatives could yield significant returns.

*Next steps: Would you like me to create a detailed report or explore specific data segments?*`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

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
      className="h-screen bg-gray-900 text-white overflow-hidden select-none"
    >
      <div className="flex h-full">
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
            onClearChat={handleClearChat}
            onExportChat={handleExportChat}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;