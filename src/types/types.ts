export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'ready' | 'error';
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isComplete?: boolean;
  sourceRecordId?: string;
}

export interface ExamplePrompt {
  id: string;
  text: string;
  icon: string;
}

export interface StoredAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  description: string;
  error?: string;
  analysisDate: Date;
}