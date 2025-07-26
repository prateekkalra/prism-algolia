import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface FileAnalysisResult {
  fileName: string;
  fileType: string;
  fileSize: string;
  description: string;
  error?: string;
}

export class FileAnalyzer {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeFile(file: File): Promise<FileAnalysisResult> {
    try {
      console.log(`Analyzing file: ${file.name}`);
      
      const fileType = this.getFileType(file);
      const fileSize = this.formatFileSize(file.size);
      
      let description = '';
      
      if (this.isTextFile(file)) {
        description = await this.analyzeTextFile(file);
      } else if (this.isImageFile(file)) {
        description = await this.analyzeImageFile(file);
      } else if (this.isPDFFile(file)) {
        description = await this.analyzePDFFile(file);
      } else if (this.isVideoFile(file)) {
        description = await this.analyzeVideoFile(file);
      } else if (this.isAudioFile(file)) {
        description = await this.analyzeAudioFile(file);
      } else {
        description = await this.analyzeGenericFile(file);
      }

      const result = {
        fileName: file.name,
        fileType,
        fileSize,
        description
      };

      console.log('Analysis Result:', result);
      
      // Automatically save to Algolia after successful analysis
      try {
        console.log('🔄 Auto-saving analysis to Algolia...');
        await this.saveToAlgolia(result);
        console.log('✅ Analysis saved to Algolia successfully');
      } catch (error) {
        console.error('⚠️ Failed to save analysis to Algolia:', error);
        // Don't fail the analysis if save fails, just log the error
      }
      
      return result;

    } catch (error) {
      console.error('File analysis error:', error);
      return {
        fileName: file.name,
        fileType: this.getFileType(file),
        fileSize: this.formatFileSize(file.size),
        description: 'Failed to analyze file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async analyzeTextFile(file: File): Promise<string> {
    const text = await file.text();
    const prompt = `Analyze this text file and provide a comprehensive description including:
    - Main topic/subject matter
    - Key themes or concepts
    - Structure and format
    - Notable content highlights
    - Word count estimate
    
    Text content:
    ${text.substring(0, 10000)}${text.length > 10000 ? '...' : ''}`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  private async analyzeImageFile(file: File): Promise<string> {
    const imageData = await this.fileToGenerativePart(file);
    const prompt = `Analyze this image and describe:
    - What you see in the image
    - Objects, people, scenes present
    - Colors, composition, style
    - Any text visible in the image
    - Overall mood or context`;

    const result = await this.model.generateContent([prompt, imageData]);
    return result.response.text();
  }

  private async analyzePDFFile(file: File): Promise<string> {
    // For PDF files, we'll convert to base64 and let AI analyze
    const base64Data = await this.fileToBase64(file);
    const prompt = `This is a PDF file. Analyze it and describe:
    - Document type and purpose
    - Main content themes
    - Structure and organization
    - Key information or data present
    - Number of pages (if detectable)`;

    try {
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        }
      ]);
      return result.response.text();
    } catch (error) {
      return `PDF Analysis: This appears to be a PDF document named "${file.name}". Unable to extract detailed content due to format limitations. The file is ${this.formatFileSize(file.size)} in size.`;
    }
  }

  private async analyzeVideoFile(file: File): Promise<string> {
    const videoData = await this.fileToGenerativePart(file);
    const prompt = `Analyze this video file and describe:
    - What happens in the video
    - Key scenes or moments
    - Visual elements and composition
    - Duration and pacing
    - Any audio elements if detectable
    - Overall content and context`;

    try {
      const result = await this.model.generateContent([prompt, videoData]);
      return result.response.text();
    } catch (error) {
      return `Video Analysis: This is a video file named "${file.name}" (${this.formatFileSize(file.size)}). Advanced video analysis requires additional processing capabilities.`;
    }
  }

  private async analyzeAudioFile(file: File): Promise<string> {
    const audioData = await this.fileToGenerativePart(file);
    const prompt = `Analyze this audio file and describe:
    - Type of audio content (music, speech, sounds)
    - Duration and quality characteristics
    - Notable audio elements
    - Content summary if speech/vocals are present`;

    try {
      const result = await this.model.generateContent([prompt, audioData]);
      return result.response.text();
    } catch (error) {
      return `Audio Analysis: This is an audio file named "${file.name}" (${this.formatFileSize(file.size)}). The file appears to contain ${this.getAudioTypeGuess(file)} content.`;
    }
  }

  private async analyzeGenericFile(file: File): Promise<string> {
    const prompt = `This is a file with the following characteristics:
    - Name: ${file.name}
    - Type: ${file.type || 'unknown'}
    - Size: ${this.formatFileSize(file.size)}
    
    Based on the filename and type, provide analysis about:
    - Likely file purpose and content
    - File format characteristics
    - Typical use cases for this file type`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  private async fileToGenerativePart(file: File) {
    const base64Data = await this.fileToBase64(file);
    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type
      }
    };
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private isTextFile(file: File): boolean {
    return file.type.startsWith('text/') || 
           ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.xml', '.csv'].some(ext => 
             file.name.toLowerCase().endsWith(ext)
           );
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private isPDFFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  private isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
  }

  private isAudioFile(file: File): boolean {
    return file.type.startsWith('audio/');
  }

  private getFileType(file: File): string {
    if (this.isTextFile(file)) return 'Text';
    if (this.isImageFile(file)) return 'Image';
    if (this.isPDFFile(file)) return 'PDF';
    if (this.isVideoFile(file)) return 'Video';
    if (this.isAudioFile(file)) return 'Audio';
    return 'Unknown';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getAudioTypeGuess(file: File): string {
    const name = file.name.toLowerCase();
    if (name.includes('music') || name.includes('song')) return 'music';
    if (name.includes('voice') || name.includes('speech')) return 'speech';
    if (name.includes('sound') || name.includes('effect')) return 'sound effect';
    return 'audio';
  }

  private async saveToAlgolia(analysisResult: FileAnalysisResult): Promise<void> {
    try {
      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisResult }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Algolia save response:', result);
    } catch (error) {
      console.error('❌ Failed to save to Algolia:', error);
      throw error;
    }
  }
}

export const fileAnalyzer = new FileAnalyzer(); 