import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { AnalysisResult } from './AnalysisResult';
import { FileAnalysisResult } from '../services/fileAnalyzer';
import { Brain, Trash2 } from 'lucide-react';

export const FileAnalysisPane: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<FileAnalysisResult[]>([]);

  const handleAnalysisComplete = (result: FileAnalysisResult) => {
    console.log('\n=== FILE ANALYSIS COMPLETE ===');
    console.log(`File: ${result.fileName}`);
    console.log(`Type: ${result.fileType}`);
    console.log(`Size: ${result.fileSize}`);
    console.log(`Description:\n${result.description}`);
    console.log('===============================\n');
    
    setAnalysisResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setAnalysisResults([]);
    console.clear();
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold">AI File Analyzer</h2>
              <p className="text-xs text-gray-400">Powered by Gemini API</p>
            </div>
          </div>
          
          {analysisResults.length > 0 && (
            <button
              onClick={clearResults}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Clear all results"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* File Uploader */}
      <div className="p-4 border-b border-gray-700">
        <FileUploader onAnalysisComplete={handleAnalysisComplete} />
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {analysisResults.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Analysis Results ({analysisResults.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Check browser console for detailed output
                </p>
              </div>
              <div className="space-y-4">
                {analysisResults.map((result, index) => (
                  <div key={`${result.fileName}-${index}`} className="bg-gray-800/50 rounded-lg">
                    <AnalysisResult result={result} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm mb-2">No files analyzed yet</p>
              <p className="text-gray-500 text-xs">
                Upload videos, audio, documents, images, or any file type above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 