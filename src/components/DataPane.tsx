import React, { useState, useRef } from 'react';
import { Upload, Plus, FileText } from 'lucide-react';
import { FileItem as FileItemType } from '../types/types';
import FileItem from './FileItem';

interface DataPaneProps {
  files: FileItemType[];
  onFilesAdded: (files: File[]) => void;
  onFileDeleted: (id: string) => void;
}

const DataPane: React.FC<DataPaneProps> = ({ files, onFilesAdded, onFileDeleted }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUpload, setShowUpload] = useState(files.length === 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesAdded(droppedFiles);
    setShowUpload(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesAdded(selectedFiles);
      setShowUpload(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddNewData = () => {
    setShowUpload(true);
  };

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-gray-200">Data Sources</h2>
        <button
          onClick={handleAddNewData}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 tooltip-container"
          title="Add New Data"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {(showUpload || files.length === 0) && (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full transition-colors ${
                isDragOver ? 'bg-blue-500/20' : 'bg-gray-800'
              }`}>
                <Upload className={`w-8 h-8 ${
                  isDragOver ? 'text-blue-400' : 'text-gray-400'
                }`} />
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-300 font-medium">
                  Drag & drop files here or{' '}
                  <button
                    onClick={handleBrowseClick}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    click to browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOCX, CSV, TXT, MD
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.csv,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {files.length > 0 && !showUpload && (
          <div className="space-y-3">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onDelete={onFileDeleted}
              />
            ))}
          </div>
        )}

        {files.length > 0 && showUpload && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className={`w-6 h-6 ${
                  isDragOver ? 'text-blue-400' : 'text-gray-400'
                }`} />
                <p className="text-sm text-gray-300">
                  Drop files here or{' '}
                  <button
                    onClick={handleBrowseClick}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    browse
                  </button>
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.csv,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  onDelete={onFileDeleted}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPane;