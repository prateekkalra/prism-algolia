import { FileAnalysisResult } from './fileAnalyzer';

export interface StoredAnalysis extends FileAnalysisResult {
  id: string;
  analysisDate: Date;
}

export class LocalStorageService {
  private static readonly STORAGE_KEY = 'prism-file-analyses';

  static saveAnalysis(analysis: FileAnalysisResult): StoredAnalysis {
    const storedAnalysis: StoredAnalysis = {
      ...analysis,
      id: this.generateId(),
      analysisDate: new Date()
    };

    const existing = this.getAllAnalyses();
    const updated = [storedAnalysis, ...existing];
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return storedAnalysis;
  }

  static getAllAnalyses(): StoredAnalysis[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        analysisDate: new Date(item.analysisDate)
      }));
    } catch (error) {
      console.error('Failed to load analyses from localStorage:', error);
      return [];
    }
  }

  static deleteAnalysis(id: string): void {
    const existing = this.getAllAnalyses();
    const filtered = existing.filter(analysis => analysis.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  static clearAllAnalyses(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getAnalysisById(id: string): StoredAnalysis | null {
    const analyses = this.getAllAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}