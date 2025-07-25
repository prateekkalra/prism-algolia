import React from 'react';
import { FileText, Image, Video, Music, FileX, AlertCircle } from 'lucide-react';
import { FileAnalysisResult } from '../services/fileAnalyzer';

interface AnalysisResultProps {
  result: FileAnalysisResult;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'text':
      return <FileText className="h-6 w-6 text-blue-500" />;
    case 'image':
      return <Image className="h-6 w-6 text-green-500" />;
    case 'video':
      return <Video className="h-6 w-6 text-purple-500" />;
    case 'audio':
      return <Music className="h-6 w-6 text-orange-500" />;
    case 'pdf':
      return <FileText className="h-6 w-6 text-red-500" />;
    default:
      return <FileX className="h-6 w-6 text-gray-500" />;
  }
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        {getFileIcon(result.fileType)}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 break-all">
            {result.fileName}
          </h3>
          <div className="flex gap-4 text-sm text-gray-500 mt-1">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {result.fileType}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              {result.fileSize}
            </span>
          </div>
        </div>
      </div>

      {result.error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Analysis Error</span>
          </div>
          <p className="text-red-700">{result.error}</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Analysis Results:</h4>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {result.description}
          </div>
        </div>
      )}
    </div>
  );
}; 