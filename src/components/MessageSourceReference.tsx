import React from 'react';
import { FileText, Image, Video, Music, FileX, ExternalLink } from 'lucide-react';
import { StoredAnalysis } from '../types/types';

interface MessageSourceReferenceProps {
  analysis: StoredAnalysis;
  onClick: () => void;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'text':
      return <FileText className="h-3 w-3 text-blue-400" />;
    case 'image':
      return <Image className="h-3 w-3 text-green-400" />;
    case 'video':
      return <Video className="h-3 w-3 text-purple-400" />;
    case 'audio':
      return <Music className="h-3 w-3 text-orange-400" />;
    case 'pdf':
      return <FileText className="h-3 w-3 text-red-400" />;
    default:
      return <FileX className="h-3 w-3 text-gray-400" />;
  }
};

const MessageSourceReference: React.FC<MessageSourceReferenceProps> = ({ analysis, onClick }) => {
  return (
    <div className="mb-2">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg text-xs text-blue-300 hover:text-blue-200 transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
      >
        {getFileIcon(analysis.fileType)}
        <span>Information from</span>
        <span className="text-blue-100 font-medium">{analysis.fileName}</span>
        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
      </button>
    </div>
  );
};

export default MessageSourceReference;