export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'ready' | 'error';
  uploadedAt: Date;
  domain?: 'entri' | 'general';
  category?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isComplete?: boolean;
  domain?: 'entri' | 'general';
  confidence?: number;
  sourceRecordId?: string;
}

export interface ExamplePrompt {
  id: string;
  text: string;
  icon: string;
  domain?: 'entri' | 'general';
  category?: string;
}

export interface StoredAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  description: string;
  error?: string;
  analysisDate: Date;
  domain?: 'entri' | 'general';
  insights?: EntriInsight[];
}

export interface EntriInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  data?: any;
}