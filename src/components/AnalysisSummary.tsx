import React from 'react';
import { FileText, Image, Video, Music, FileX, Trash2, Eye, Calendar } from 'lucide-react';
import { StoredAnalysis } from '../types/types';

interface AnalysisSummaryProps {
  analysis: StoredAnalysis;
  onViewDetails: (analysis: StoredAnalysis) => void;
  onDelete: (id: string) => void;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'text':
      return <FileText className="h-4 w-4 text-blue-400" />;
    case 'image':
      return <Image className="h-4 w-4 text-green-400" />;
    case 'video':
      return <Video className="h-4 w-4 text-purple-400" />;
    case 'audio':
      return <Music className="h-4 w-4 text-orange-400" />;
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-400" />;
    default:
      return <FileX className="h-4 w-4 text-gray-400" />;
  }
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  analysis,
  onViewDetails,
  onDelete
}) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 hover:bg-gray-800/70 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getFileIcon(analysis.fileType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate" title={analysis.fileName}>
            {analysis.fileName}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
              {analysis.fileType}
            </span>
            <span className="text-xs text-gray-500">
              {analysis.fileSize}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(analysis.analysisDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(analysis)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
            title="View details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={() => onDelete(analysis.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
            title="Delete analysis"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      {analysis.error && (
        <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
          Error: {analysis.error}
        </div>
      )}
    </div>
  );
};