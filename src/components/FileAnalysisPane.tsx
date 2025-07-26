import React, { useState, useEffect } from 'react';
import { FileUploader } from './FileUploader';
import { AnalysisSummary } from './AnalysisSummary';
import { AnalysisDetailDialog } from './AnalysisDetailDialog';
import { FileAnalysisResult } from '../services/fileAnalyzer';
import { StoredAnalysis } from '../types/types';
import { LocalStorageService } from '../services/localStorage';
import { Trash2 } from 'lucide-react';

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
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/prism-logo.svg" alt="Prism" className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Smart Analytics</h2>
              <p className="text-xs text-gray-400">Intelligent File Insights</p>
            </div>
          </div>
          
          {storedAnalyses.length > 0 && (
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
          {storedAnalyses.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Insights Library ({storedAnalyses.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Click any item to explore detailed insights
                </p>
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
            <div className="text-center py-8">
              <img src="/prism-logo.svg" alt="Prism" className="w-12 h-12 mx-auto opacity-60 mb-4" />
              <p className="text-gray-400 text-sm mb-2">Ready to unlock insights</p>
              <p className="text-gray-500 text-xs">
                Drop any file above to discover patterns, extract data, and generate intelligent summaries
              </p>
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