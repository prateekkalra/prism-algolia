# Prism Data Processing Demo - Split Panel UI

This demonstrates Prism's AI-powered data processing with the dual-panel interface.

## UI Layout

**Left Panel**: Data Processing
- Drag & drop file upload area
- Real-time analysis results
- Console output logging

**Right Panel**: Chat Interface  
- Interactive chat with AI
- Export and clear functionality
- Mock data analysis responses

**Resizable Divider**: Drag to adjust panel sizes

## What Happens When You Upload Files

### 1. Upload Process
1. **Drag & drop** any file into the left panel upload area
2. **AI processes** using advanced AI in real-time
3. **Results appear** in both the left panel and browser console
4. **Chat on right** remains available for further questions

### 2. Console Output Example

Open browser dev tools (F12 → Console) to see detailed logs:

```
=== FILE ANALYSIS COMPLETE ===
File: example-video.mp4
Type: Video
Size: 15.2 MB
Description:
This video file contains a presentation or demonstration sequence. Key observations:

- **Content Type**: Educational/tutorial video
- **Visual Elements**: Screen recording with interface elements
- **Duration**: Approximately 3-5 minutes based on file size
- **Quality**: High definition with clear visual elements
- **Audio**: Likely contains narration or background audio
- **Purpose**: Appears to be instructional content

The video shows a software interface with multiple windows and interactive elements, suggesting it's a tutorial or product demonstration. The pacing appears steady with clear transitions between scenes.
===============================
```

### 3. Left Panel Results

Results display in the left panel with:
- **File info**: Name, type, size with appropriate icons
- **Analysis summary**: Condensed description
- **Error handling**: Graceful failure messages if processing fails
- **Scrollable history**: Previous analyses remain visible

## File Type Examples

### Text Files (.txt, .md, .json, .js, .ts, etc.)
- **Analysis focus**: Content themes, code structure, word count
- **Special handling**: Programming language detection
- **Console output**: Detailed content summary and key concepts

### Images (.jpg, .png, .gif, .webp, etc.)
- **Analysis focus**: Visual content, objects, text recognition
- **Special handling**: Color analysis, composition assessment
- **Console output**: Detailed scene description and mood analysis

### Videos (.mp4, .avi, .mov, .webm, etc.)
- **Analysis focus**: Scene content, visual elements, duration
- **Special handling**: Frame analysis, audio detection
- **Console output**: Comprehensive video breakdown

### Audio (.mp3, .wav, .aac, .flac, etc.)
- **Analysis focus**: Content type (music/speech), quality
- **Special handling**: Speech transcription when possible
- **Console output**: Audio characteristics and content summary

### Documents (.pdf, .docx, .xlsx, etc.)
- **Analysis focus**: Document type, structure, key information
- **Special handling**: Text extraction, page estimation
- **Console output**: Document analysis and content themes

### Other Files
- **Analysis focus**: File purpose based on extension and metadata
- **Special handling**: Intelligent guessing based on file characteristics
- **Console output**: File format explanation and use cases

## Interactive Features

### Left Panel Features
- **Drag & drop upload**: Visual feedback during drag operations
- **Loading states**: Spinner and progress indicators
- **Clear results**: Trash button to clear all processing history
- **Scrollable results**: View multiple file analyses

### Right Panel Features  
- **Chat interface**: Ask questions about uploaded files
- **Export chat**: Download conversation history
- **Clear chat**: Reset conversation
- **Mock responses**: Realistic AI-style responses for demonstration

### Resizable Layout
- **Drag divider**: Adjust panel sizes between 20%-60% split
- **Smooth transitions**: Animated panel resizing
- **Persistent sizes**: Panel sizes maintained during session

## Try It Now

1. **Setup**: Ensure your AI API key is in `.env` 
2. **Upload**: Drag any file to the left panel
3. **Watch**: See results in both UI and console (F12)
4. **Chat**: Use right panel for additional questions
5. **Resize**: Drag the center divider to adjust layout

## Console Monitoring

Always keep browser dev tools open (F12 → Console) to see the complete analysis output for each uploaded file! 