import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { FileItem as FileItemType } from '../types/types';

interface FileItemProps {
  file: FileItemType;
  onDelete: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
    if (type.includes('csv') || type.includes('spreadsheet')) return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
    if (type.includes('doc')) return <FileText className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'processing':
        return <Clock className="w-3 h-3 text-yellow-400 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'processing':
        return 'Processing...';
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getFileIcon(file.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {getStatusIcon()}
            <span className="text-xs text-gray-400">{getStatusText()}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {file.status === 'ready' && (
          <button className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(file.id)}
          className="p-1.5 rounded-md hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;