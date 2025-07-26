import React, { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { AnalysisSummary } from './AnalysisSummary';
import { AnalysisDetailDialog } from './AnalysisDetailDialog';
import { FileAnalysisResult } from '../services/fileAnalyzer';
import { StoredAnalysis } from '../types/types';
import { LocalStorageService } from '../services/localStorage';
import { Trash2, Upload } from 'lucide-react';

export const FileAnalysisPane: React.FC = () => {
  const [storedAnalyses, setStoredAnalyses] = useState<StoredAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<StoredAnalysis | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadStoredAnalyses();
  }, []);

  const loadStoredAnalyses = () => {
    const analyses = LocalStorageService.getAllAnalyses();
    setStoredAnalyses(analyses);
  };

  const handleAnalysisComplete = (result: FileAnalysisResult) => {
    console.log('\n=== FILE ANALYSIS COMPLETE ===');
    console.log(`File: ${result.fileName}`);
    console.log(`Type: ${result.fileType}`);
    console.log(`Size: ${result.fileSize}`);
    console.log(`Description:\n${result.description}`);
    console.log('===============================\n');
    
    const storedAnalysis = LocalStorageService.saveAnalysis(result);
    setStoredAnalyses(prev => [storedAnalysis, ...prev]);
  };

  const handleViewDetails = (analysis: StoredAnalysis) => {
    setSelectedAnalysis(analysis);
    setIsDialogOpen(true);
  };

  const handleDeleteAnalysis = (id: string) => {
    LocalStorageService.deleteAnalysis(id);
    setStoredAnalyses(prev => prev.filter(analysis => analysis.id !== id));
  };

  const clearResults = () => {
    LocalStorageService.clearAllAnalyses();
    setStoredAnalyses([]);
    console.clear();
  };

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Upload Section */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Upload Sources</h2>
          <p className="text-sm text-gray-400">
            Add files to your knowledge base, then chat about them
          </p>
        </div>
        <FileUploader onAnalysisComplete={handleAnalysisComplete} />
      </div>


      {/* Sources Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 pb-6 scrollbar-custom">
          {storedAnalyses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 mb-1">
                    Knowledge Base
                  </h3>
                  <p className="text-xs text-gray-500">
                    {storedAnalyses.length} source{storedAnalyses.length !== 1 ? 's' : ''} • Click to view details
                  </p>
                </div>
                <button
                  onClick={clearResults}
                  className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Clear all sources"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {storedAnalyses.map((analysis) => (
                  <AnalysisSummary
                    key={analysis.id}
                    analysis={analysis}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDeleteAnalysis}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No sources yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                Upload documents, images, spreadsheets, or any file type to start analyzing with AI
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-800/50 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                <span>Then ask questions in the chat</span>
                <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Detail Dialog */}
      <AnalysisDetailDialog
        analysis={selectedAnalysis}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};