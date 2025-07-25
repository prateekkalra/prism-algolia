import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
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
          <div className="space-y-4">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
                <p className="text-lg font-medium">Analyzing {currentFile}...</p>
                <p className="text-sm text-gray-500">This may take a moment</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-lg font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500">
                    Supports video, audio, text, PDF, images, and more
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>
      
      {isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-800">
              Processing with Gemini AI...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 