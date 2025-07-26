import React from 'react';
import { FileText, Image, Video, Music, FileX, AlertCircle } from 'lucide-react';
import { FileAnalysisResult } from '../services/fileAnalyzer';

interface AnalysisResultProps {
  result: FileAnalysisResult;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'text':
      return <FileText className="h-5 w-5 text-blue-400" />;
    case 'image':
      return <Image className="h-5 w-5 text-green-400" />;
    case 'video':
      return <Video className="h-5 w-5 text-purple-400" />;
    case 'audio':
      return <Music className="h-5 w-5 text-orange-400" />;
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-400" />;
    default:
      return <FileX className="h-5 w-5 text-gray-400" />;
  }
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-start gap-3 mb-3">
        {getFileIcon(result.fileType)}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate" title={result.fileName}>
            {result.fileName}
          </h3>
          <div className="flex gap-2 text-xs text-gray-400 mt-1">
            <span className="bg-gray-700 px-2 py-0.5 rounded">
              {result.fileType}
            </span>
            <span className="bg-gray-700 px-2 py-0.5 rounded">
              {result.fileSize}
            </span>
          </div>
        </div>
      </div>

      {result.error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Analysis Error</span>
          </div>
          <p className="text-red-300 text-xs">{result.error}</p>
        </div>
      ) : (
        <div className="bg-gray-700/50 rounded-lg p-3">
          <h4 className="text-xs font-medium text-gray-300 mb-2">Analysis:</h4>
          <div className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
            {result.description}
          </div>
        </div>
      )}
    </div>
  );
}; 