import React, { useCallback, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { fileAnalyzer, FileAnalysisResult } from '../services/fileAnalyzer';

interface FileUploaderProps {
  onAnalysisComplete?: (result: FileAnalysisResult) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onAnalysisComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const handleFileAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentFile(file.name);
    
    try {
      const result = await fileAnalyzer.analyzeFile(file);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setCurrentFile(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileAnalysis);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(handleFileAnalysis);
  }, []);

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
          accept="*/*"
        />
        
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="space-y-3">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-10 w-10 mx-auto text-blue-400 animate-spin" />
                <p className="text-sm font-medium text-white">Processing {currentFile}...</p>
                <p className="text-xs text-gray-400">This may take a moment</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">Drop files here or click to upload</p>
                  <p className="text-xs text-gray-400">
                    Supports video, audio, text, PDF, images, and more
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>
      
      {isAnalyzing && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span className="text-xs text-blue-300">
              Processing with AI...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 