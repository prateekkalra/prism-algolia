import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { FileAnalysisResult } from './services/fileAnalyzer';
import { Brain, Github } from 'lucide-react';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AI File Analyzer
                </h1>
                <p className="text-sm text-gray-500">
                  Powered by Google Gemini API
                </p>
              </div>
            </div>
            
            {analysisResults.length > 0 && (
              <button
                onClick={clearResults}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Upload any file for AI analysis
          </h2>
          <p className="text-gray-600">
            Drop videos, audio files, documents, images, PDFs, or any other file type. 
            Results will appear below and in the browser console.
          </p>
        </div>

        {/* File Uploader */}
        <div className="mb-8">
          <FileUploader onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {analysisResults.length > 0 && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Analysis Results ({analysisResults.length})
              </h3>
            </div>
          )}
          
          {analysisResults.map((result, index) => (
            <AnalysisResult key={`${result.fileName}-${index}`} result={result} />
          ))}
          
          {analysisResults.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Brain className="h-16 w-16 mx-auto opacity-50" />
              </div>
              <p className="text-gray-500">
                No files analyzed yet. Upload a file to get started!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Built with React, TypeScript, and Google Gemini AI • 
              Check the browser console for detailed output
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;